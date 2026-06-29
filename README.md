# FitEasy

แอปออกกำลังกายส่วนตัว สร้างแผนการฝึกตามข้อมูลร่างกายและเป้าหมายของคุณ

## วิธีทดสอบบน Samsung S26 Ultra

### วิธีที่ 1: ใช้ Expo Go (ง่ายที่สุด)

1. ดาวน์โหลด **Expo Go** จาก Google Play Store บน Samsung S26 Ultra
2. รันคำสั่งนี้บนเครื่องคอม:
   ```
   npm start
   ```
3. สแกน QR Code ที่ขึ้นในเทอร์มินัลด้วยแอป Expo Go

### วิธีที่ 2: Build เป็น APK ติดตั้งได้โดยตรง

1. สมัคร account ที่ https://expo.dev (ฟรี)
2. ติดตั้ง EAS CLI:
   ```
   npm install -g eas-cli
   ```
3. Login:
   ```
   eas login
   ```
4. Build APK:
   ```
   eas build --platform android --profile preview
   ```
5. ดาวน์โหลด APK จาก link ที่ได้ แล้วติดตั้งบน Samsung S26 Ultra

---

## Flow ของแอป

```
Splash → Gender → Goal → Fitness Level → Target Zones →
Injuries → Workout Duration → Science Fact → Height →
Current Weight → Target Weight → Water Intake →
Hydration Reminder → Diet Style → Training Days →
Training Time → Workout Location → Equipment →
Plan Generating → Home Dashboard
```

## Features

- **17 ขั้นตอน onboarding** รวบรวมข้อมูลส่วนตัว
- **Interactive body model** เลือก muscle zones ที่ต้องการ
- **Scroll picker** เลือกส่วนสูงและน้ำหนัก (รองรับ cm/ft, kg/lbs)
- **Equipment selector** เลือกอุปกรณ์ที่มี
- **Workout plan generator** สร้างแผนการฝึก 7 วัน อัตโนมัติ
- **Home Dashboard** แสดงแผนวันนี้, ตาราง weekly, BMI, stats

## พัฒนาต่อ

ถ้าต้องการรีเซ็ต onboarding กดไอคอนโปรไฟล์มุมบนขวาในหน้า Home
