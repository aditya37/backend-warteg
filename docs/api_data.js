define({ "api": [
  {
    "type": "post",
    "url": "auth/authVendor",
    "title": "",
    "name": "AuthVendor",
    "group": "Vendor",
    "description": "<p>Auth berfungsi untuk proses autentikasi akun vendor, baik vendor lama atau vendor yang baru terdaftar dalam sistem aplikasi ini jika proses autentikasi berhasil nanti akan muncul pesan atau respon berupa json, respon tersebut berfungsi untuk proses selanjutnya</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Username",
            "description": "<p>username vendor yang terdaftar</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Password",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example(json):",
          "content": "{\n  \"username\":\"vendorTes\",\n  \"password\":\"password\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Id Vendor</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username Vendor</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Emaail Vendor</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password Vendor Yang Sudah dienkripsi</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "dateCreated",
            "description": "<p>Tanggal Registrasi Vendor</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "dateUpdated",
            "description": "<p>Tanggal vendor melakukan perubahan akun </br> ex: Update Username atau ganti kata sandi</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Auth",
          "content": "{\n    \"success\":\"1\"\n    \"message\": \"Login Sucessfully\",\n    \"vendor\": [\n       {\n            \"_id\": \"5dd59c87cf1f4129a5b9d060\",\n            \"username\": \"vendorTes\",\n            \"email\": \"vendorTes@gmail.com\",\n            \"password\": \"$2b$10$SlhI.v.hhqwJaOWKp.ZMC.GMt2NP2HC17JLhqD8kLteX49Vq3pkKm\",\n            \"dateCreated\": \"2019-02-22T00:00:00.000Z\",\n            \"dateUpdated\": \"2019-03-22T00:00:00.000Z\"\n       }\n    ]\n}",
          "type": "json"
        },
        {
          "title": "Failed Auth",
          "content": "{\n \"Success\": \"0\"\n \"message\": \"Gagal\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./api/routes/authRoutes/authVendor.js",
    "groupTitle": "Vendor"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./docs/main.js",
    "group": "_home_aditya_backend_android_restAPI_makhan_docs_main_js",
    "groupTitle": "_home_aditya_backend_android_restAPI_makhan_docs_main_js",
    "name": ""
  }
] });
