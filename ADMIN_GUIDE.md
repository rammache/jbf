# Jabour Phone - Admin Manual & Store Management Guide
# دليل إدارة متجر جبور فون

Welcome Jabour! This guide explains how to manage your entire online store, products, categories, stock, customer orders, and site settings without needing a developer.

---

## 🇱🇧 ملخص سريع بالعربية (Quick Arabic Summary)
- **تسجيل الدخول:** افتح الرابط `/admin/login` وأدخل بريدك الإلكتروني وكلمة المرور.
- **إضافة المنتجات:** اضغط على **Products** ثم **+ Add Product**. حمّل صور الهاتف، حدد السعر والكمية في المخزن والمواصفات (البطارية، الكاميرا، السعة).
- **إدارة الطلبات:** من صفحة **Orders** يمكنك رؤية كل طلبات الزبائن الجديدة، وتغيير حالتها (Pending -> Confirmed -> Shipped -> Delivered)، والتواصل المباشر مع الزبون عبر واتساب بضغطة زر.
- **إلغاء الطلب:** عند إلغاء أي طلب، يقوم النظام أوتوماتيكياً بإعادة كمية الهواتف إلى المخزن.
- **إعدادات المتجر:** من صفحة **Settings** يمكنك تغيير رقم الواتساب، ورسوم التوصيل، وساعات العمل، وعنوان المعرض في بيروت في أي وقت.

---

## 1. Accessing Your Admin Panel

1. Go to: `https://your-domain.com/admin/login` (or `http://localhost:5000/admin/login`).
2. Log in with your admin email and password.
3. Once logged in, your session stays active securely for 8 hours.
4. To change your password: Click your name in the sidebar -> **Admin Settings** -> **Security & Password**.

---

## 2. Executive Dashboard Overview

When you log in, the Dashboard shows your business at a glance:
- **Today's Orders & Revenue:** New orders placed today and total cash volume.
- **Order Pipeline:** Visual counts of orders in `Pending`, `Confirmed`, `Shipped`, and `Delivered`.
- **Low Stock Alerts:** Highlights any phones running low in stock so you can reorder from suppliers.
- **Recent Orders Table:** Quick access to the newest customer purchases.
- **Profit & Margin Report:** Click "View Profit Report" to see gross sales, cost of goods, and profit margins.

---

## 3. Managing Categories (الأقسام)

Navigate to **Categories** in the admin sidebar.

### Adding a New Category
1. Click **+ Add Category**.
2. Enter the Category Name (e.g. `Smart Phones`, `Smartwatches`).
3. The URL slug is generated automatically.
4. Add a short description and upload a cover photo.
5. Click **Save Category**.

### Changing Category Order on the Storefront
1. In the category table, use the **▲ Up** and **▼ Down** arrows to adjust the display order.
2. Click **Save Order** to publish the changes to the storefront navbar and home tabs.

### Deleting a Category Safely
If a category contains products, the system will protect you from accidental loss by asking you to **reassign** those products to another category before deleting.

---

## 4. Managing Products (المنتجات والهواتف)

Navigate to **Products** in the admin sidebar.

### Adding a New Product / Phone
1. Click **+ Add Product**.
2. **Basic Information:**
   - **Title:** e.g. `Samsung Galaxy S24 Ultra 512GB`
   - **Category:** Select from your categories.
   - **Brand:** e.g. `Samsung`, `Apple`, `Xiaomi`.
   - **Selling Price:** Customer price in USD (e.g. `1199.00`).
   - **Compare Price (Optional):** Original price before discount (e.g. `1299.00`). If entered, a "SALE" badge displays on the storefront.
3. **Inventory & Stock:**
   - **Stock Quantity:** Available units in your store.
   - **Low Stock Alert:** The threshold that triggers an alert (e.g. 2 units).
   - *Note:* When stock hits 0, the storefront automatically displays "Out of Stock" and prevents checkout.
4. **Phone Specifications:**
   - Screen (e.g. `6.8" Dynamic AMOLED 2X, 120Hz`)
   - Battery (e.g. `5000 mAh, 45W Fast Charging`)
   - Camera (e.g. `200MP Main + 50MP Periscope`)
   - Storage (e.g. `512GB`) & RAM (e.g. `12GB`)
   - Condition (`New`, `Used`, or `Refurbished`)
   - Warranty (e.g. `1-Year Official Warranty`)
5. **Photo Upload:**
   - Click **Upload Images** and select one or more photos.
   - Click the **Star icon** on any photo to set it as the Primary Cover Image.
   - Use the arrow buttons to reorder photos.
6. Click **Save Product**.

### Duplicating a Product
To quickly add a different storage variant or color of an existing phone:
- Click the **Duplicate** button in the product table row.
- A draft copy is created instantly for you to adjust price and storage.

---

## 5. Managing Orders & Deliveries (الطلبات والتوصيل)

Navigate to **Orders** in the admin sidebar.

### Order Workflow:
1. **PENDING (قيد الانتظار):** Customer placed a Cash on Delivery (COD) order.
2. **CONFIRMED (تم التأكيد):** You verified the order details with the customer.
3. **PROCESSING (قيد التجهيز):** Phone is being packaged in your showroom.
4. **SHIPPED (تم الشحن مع الدليفري):** Courier has collected the package for delivery.
5. **DELIVERED (تم التسليم واستلام المبلغ):** Customer received the phone and paid the courier.
6. **CANCELLED (ملغي):** Customer cancelled or rejected order.

### Order Detail Modal Features:
- **WhatsApp Customer Shortcut:** Click the green WhatsApp button to open a direct chat with the customer prefilled with their order number.
- **Print Packing Slip:** Print a clean receipt slip with customer address and total to include inside the package for the courier.
- **Inventory Safety:** If you cancel an order, the system **automatically restores the product stock** into your inventory.

---

## 6. Discount Coupons & Promotions (كوبونات الخصم)

Navigate to **Coupons** in the admin sidebar.
- Click **+ Create Coupon**.
- Enter a coupon code (e.g. `SUMMER10`, `WELCOME5`).
- Select **Percentage Discount** (e.g. 10%) or **Fixed Amount** (e.g. $10 off).
- Set an optional maximum discount cap, minimum order subtotal, or expiration date.

---

## 7. Newsletter Subscribers (المشتركون)

Navigate to **Newsletter** in the admin sidebar.
- View customer emails collected from the storefront footer.
- Click **Export CSV** to download a spreadsheet of emails for WhatsApp or email marketing campaigns.

---

## 8. Store Settings (إعدادات المتجر)

Navigate to **Settings** in the admin sidebar.
- **Store Profile:** Update store name, email, direct phone, WhatsApp number, showroom address (`Beirut, Lebanon`), and operating hours.
- **Commerce & Shipping:** Update standard delivery fee (default: `$5.00`), free shipping threshold (default: `$50.00`), and currency symbol (`$`).
- **Announcement Banner:** Update the rotating message at the top of the storefront (e.g. "🚚 Free Delivery in Beirut Today").
- **Admin Accounts:** Create staff accounts or update passwords.
