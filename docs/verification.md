# Email and phone verification

## Why it was not working

Nothing was wrong with the verification *logic*. Codes were generated, stored
against the user with an expiry, and checked correctly on `verify-code`.

The codes were never delivered, for three separate reasons:

1. **`ZEPTO_API_KEY` was an empty string.** The ZeptoMail client was built with
   an empty token, every send was rejected, and `issueCode` swallows delivery
   errors by design so the request still returned `201`.
2. **`TERMII_API_KEY` was also empty**, so phone codes went nowhere either.
3. **The Termii URL was malformed.** The code built
   `https://${TERMII_BASE_URL}/api/sms/send` while `TERMII_BASE_URL` was already
   `https://api.ng.termii.com`, producing `https://https://api.ng.termii.com/...`.
   SMS could not have worked even with a valid key.

On top of that, the API answered `"Verification code sent to …"` regardless of
what happened, so a total delivery failure was indistinguishable from a slow
SMS. That response now carries `delivered: true | false`.

## Email — genuinely free

| Provider | Free tier | Notes |
|---|---|---|
| **Resend** | 3,000/month, 100/day | Recommended. Cleanest setup, good deliverability. |
| **Brevo** | 300/day (~9,000/month) | Higher monthly ceiling, daily cap is lower. |
| **AWS SES** | ~$0.10 per 1,000 | Not free, but negligible, and the account is already on AWS. Needs a production-access request to leave the sandbox (~24h). |
| ZeptoMail | none | From $2.50 per 10,000. Already integrated. |

At Vaultiva's stage 3,000/month is far more headroom than signups will need, so
**Resend, free tier** is the answer.

### Current state — working

Configured and verified in production on 8 September 2026:

```
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...            # in the Vaultiva Resend account
MAIL_FROM=no-reply@vaultivahq.com
```

`POST /auth/register` with an email returns `delivered: true`, and a message
sent from `no-reply@vaultivahq.com` reached `delivered` status at Resend.

DNS lives in Namecheap under *Advanced DNS*: `resend._domainkey` (TXT, DKIM),
`rsend` and `send` (CNAME), `_dmarc` (TXT). The published DKIM value was
byte-compared against what Resend expects and matches exactly.

> Resend's dashboard may still show the domain as **pending** for some hours
> after sending already works — its verification checker lags DNS propagation.
> Do not treat that badge as the source of truth; the delivery status of an
> actual message is.

> **Note:** `MAIL_FROM` previously defaulted to `no-reply@vaultiva.com`. That is
> not the domain in use, and every provider rejects an unverified sender
> domain.

## Phone — there is no free option

Every gateway that reaches a Nigerian handset charges per message; Termii is
roughly ₦4 each. "Free SMS verification" does not exist here:

- **Firebase Phone Auth** moved to paid billing and charges per verification.
- **Africa's Talking** has a free sandbox, but it only delivers to their
  simulator, never to a real number.
- **Twilio Verify** is ~$0.05 per check, with a one-off trial credit.
- **WhatsApp Cloud API** bills authentication conversations in Nigeria.

### What to do instead

**Verify email at signup; do not verify the phone with an OTP.**

The phone number is still collected and stored — it just is not the thing that
proves identity. For a Nigerian fintech the phone gets verified for free as a
side effect of KYC: the BVN lookup returns the phone number registered against
that BVN with the bank, and comparing it to what the user typed is both free and
considerably stronger than an SMS OTP, which only proves possession of a SIM.

That path already exists in the codebase — `provisionBankAccount` requires BVN
and date of birth before an account can be created.

### Termii, as actually configured

The Termii credentials in use belong to the **Prime Finance** workspace
(`primefinancials68@gmail.com`), not a Vaultiva account, so Vaultiva's SMS is
billed to that wallet — about NGN 9,270 at last check, roughly 2,300 messages at
NGN 5 each.

**SMS is not sending yet, and the blocker is the sender ID.** Termii's dashboard
lists three sender IDs and its table shows all three as "Approved", but that
display is wrong — the summary line on the same page says "1 approved · 2
declined", and `GET /api/sender-id` agrees:

| Sender ID     | Real status |
|---------------|-------------|
| `09162673073` | declined    |
| `09113378646` | declined    |
| `Prime Loan`  | **active**  |

Sending with either declined ID returns HTTP 422:

```
SENDER_ID_NOT_APPROVED: sender ID '09162673073' is DECLINED for workspace
2c3a78e1-… in every country it is registered for
```

Only `Prime Loan` delivers, and only on the `generic` channel — the `dnd` route
is not enabled for this workspace (`Route not configured … channel=SMS
route=DND`), and `N-Alert` is not registered to it.

`TERMII_SENDER_ID` is therefore set to **`Prime Loan`** as a deliberate stopgap,
chosen on 8 September 2026 so that phone verification works now. Recipients see
Vaultiva's OTP arrive from a sender named "Prime Loan", which is wrong branding
and should not be left in place.

**To fix it:** request the sender ID `Vaultiva` in the Termii dashboard
(Configure → IDs → Request New Sender ID). Approval takes 1–3 business days.
When it is approved, change one variable and nothing else:

```bash
# The value contains no space, so the shorthand is safe here.
aws elasticbeanstalk update-environment   --environment-name vaultiva-api-prod --region eu-west-1   --option-settings 'Namespace=aws:elasticbeanstalk:application:environment,OptionName=TERMII_SENDER_ID,Value=Vaultiva'
```

Verified working end to end on 8 September 2026: `POST /auth/register` with a
phone number returns `delivered: true`, the Termii wallet was debited NGN 5, and
`POST /auth/verify-code` rejects a wrong code for that number — so the code is
stored and checkable.

Two consequences worth knowing:

- Nigerian **DND** blocks `generic`-channel SMS to a large share of numbers.
  Until the DND route is enabled on the workspace, delivery will be patchy even
  with an approved sender ID. This is another reason not to make phone
  verification the primary path.
- A sender ID containing a space cannot be set through the AWS CLI's
  `--option-settings` shorthand; it silently fails the whole configuration
  update and Elastic Beanstalk rolls back and goes Red. Use
  `--option-settings file://opts.json` for any value with a space.

## Local development

With no provider key set, the transport falls back to `log` and the code is
written to the application log:

```
[email:log] No provider configured. To=user@example.com Subject="Verification Code" Code=418302
```

This is refused when `NODE_ENV=production` — an undelivered OTP that nobody
notices is exactly the failure this document exists to describe.
