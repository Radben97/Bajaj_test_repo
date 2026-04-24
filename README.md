# Hierarchy Analyzer API & UI - for Bajaj online test

## 🚀 Live Application

Use the deployed app here:

👉 https://your-app-name.onrender.com

---

## 🧪 How to Use

### **1. Open the URL**

Go to the link above in your browser.

---

### **2. Enter Input**

Provide node relationships in the input box using this format:

```
A->B, A->C, B->D
```

### Rules:

* Only uppercase letters (`A-Z`)
* Format must be `Parent->Child`
* No spaces inside entries (spaces around commas are fine)

---

### **3. Submit**

Click the **Submit** button.

---

### **4. View Results**

You will see:

* 🌳 **Hierarchies (Tree Structure)**
* 🔁 **Cycle Detection**
* ❌ **Invalid Entries**
* ⚠️ **Duplicate Edges**
* 📊 **Summary**

  * Total Trees
  * Total Cycles
  * Largest Tree Root

---

## 📡 API Usage

You can also directly call the API:

### Endpoint

```
POST /bfhl
```

### Full URL

```
https://your-app-name.onrender.com/bfhl
```

---

### Example Request

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

---

### Example Response

```json
{
  "user_id": "yourname_ddmmyyyy",
  "email_id": "your@email.com",
  "college_roll_number": "your_roll",
  "hierarchies": [...],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

---

## ⚠️ Notes

* API only accepts **POST requests**
* Sending requests to `/` will not work
* Ensure proper JSON format in request body

---

## 🛠 Tech Stack

* Backend: Node.js, Express
* Frontend: HTML, CSS, JavaScript
* Deployment: Render

---

## 📌 Author

Replace the following with your details:

* Name: Maheshwaran
* Email: [amaheshwaran.2005@gmail.com](mailto:your@email.com)
* Roll Number: RA2311004010152

---

## ✅ Status

✔ Fully functional
✔ Deployed
✔ Ready for evaluation

---
