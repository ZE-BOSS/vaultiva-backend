+import { IsEmail, IsString, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
+import { Role } from '../../users/entities/user.entity';
 
-  private getExpiryDate(minutes = 30): Date {
-    const date = new Date();
-    date.setMinutes(date.getMinutes() + minutes);
-    return date;
-  }
+export class CreateUserDto {
+  @IsEmail()
+  email: string;
+
+  @IsString()
+  @MinLength(8)
+  password: string;
+
+  @IsString()
+  firstName: string;
+
+  @IsString()
+  lastName: string;
+
+  @IsOptional()
+  @IsString()
+  username?: string;
+
+  @IsOptional()
+  @IsPhoneNumber()
+  phone?: string;
+
+  @IsOptional()
+  @IsString()
+  bvn?: string;
+
+  @IsOptional()
+  @IsString()
+  nin?: string;
+
+  @IsOptional()
+  @IsString()
+  address?: string;
+
+  @IsOptional()
+  role?: Role;
 }
+