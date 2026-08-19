"use client";
import React, { useState, useEffect } from 'react';

const ordersList = [
  {
    "id": "ORD-2024-50001",
    "customer": "Sanjay Singh",
    "device": "iPhone 14 Pro (256GB)",
    "price": "₹15750",
    "status": "Assigned",
    "partner": "Rohit Mehra",
    "date": "2 Jun 2024"
  },
  {
    "id": "ORD-2024-50002",
    "customer": "Manoj Reddy",
    "device": "iPhone 15 Pro Max (512GB)",
    "price": "₹16500",
    "status": "Picked Up",
    "partner": "Sanjay Gupta",
    "date": "3 Jun 2024"
  },
  {
    "id": "ORD-2024-50003",
    "customer": "Kunal Kapoor",
    "device": "Galaxy S23 Ultra (256GB)",
    "price": "₹17250",
    "status": "Under Inspection",
    "partner": "Manoj Joshi",
    "date": "4 Jun 2024"
  },
  {
    "id": "ORD-2024-50004",
    "customer": "Sarah Kumar",
    "device": "Galaxy S24 (128GB)",
    "price": "₹18000",
    "status": "Completed",
    "partner": "Kunal Chawla",
    "date": "5 Jun 2024"
  },
  {
    "id": "ORD-2024-50005",
    "customer": "Karan Sen",
    "device": "OnePlus 11 5G (256GB)",
    "price": "₹18750",
    "status": "Pending",
    "partner": "Sarah Malhotra",
    "date": "6 Jun 2024"
  },
  {
    "id": "ORD-2024-50006",
    "customer": "Aditya Connor",
    "device": "Google Pixel 8 (128GB)",
    "price": "₹19500",
    "status": "Assigned",
    "partner": "Karan Bose",
    "date": "7 Jun 2024"
  },
  {
    "id": "ORD-2024-50007",
    "customer": "Neha Mehra",
    "device": "MacBook Air M2 (256GB)",
    "price": "₹20250",
    "status": "Picked Up",
    "partner": "Aditya Nair",
    "date": "8 Jun 2024"
  },
  {
    "id": "ORD-2024-50008",
    "customer": "Rohan Gupta",
    "device": "MacBook Pro M3 (512GB)",
    "price": "₹21000",
    "status": "Under Inspection",
    "partner": "Neha Sharma",
    "date": "9 Jun 2024"
  },
  {
    "id": "ORD-2024-50009",
    "customer": "Anjali Joshi",
    "device": "Dell XPS 13 (512GB)",
    "price": "₹21750",
    "status": "Completed",
    "partner": "Rohan Patel",
    "date": "10 Jun 2024"
  },
  {
    "id": "ORD-2024-50010",
    "customer": "Deepak Chawla",
    "device": "ThinkPad X1 Carbon (1TB)",
    "price": "₹22500",
    "status": "Pending",
    "partner": "Anjali Verma",
    "date": "11 Jun 2024"
  },
  {
    "id": "ORD-2024-50011",
    "customer": "Vijay Malhotra",
    "device": "iPad Air 5 (64GB)",
    "price": "₹23250",
    "status": "Assigned",
    "partner": "Deepak Singh",
    "date": "12 Jun 2024"
  },
  {
    "id": "ORD-2024-50012",
    "customer": "Rajesh Bose",
    "device": "iPad Pro M2 (256GB)",
    "price": "₹24000",
    "status": "Picked Up",
    "partner": "Vijay Reddy",
    "date": "13 Jun 2024"
  },
  {
    "id": "ORD-2024-50013",
    "customer": "Suresh Nair",
    "device": "Galaxy Tab S9 (128GB)",
    "price": "₹24750",
    "status": "Under Inspection",
    "partner": "Rajesh Kapoor",
    "date": "14 Jun 2024"
  },
  {
    "id": "ORD-2024-50014",
    "customer": "Divya Sharma",
    "device": "Apple Watch S9 (45mm)",
    "price": "₹25500",
    "status": "Completed",
    "partner": "Suresh Kumar",
    "date": "15 Jun 2024"
  },
  {
    "id": "ORD-2024-50015",
    "customer": "Amit Patel",
    "device": "Apple Watch Ultra 2 (49mm)",
    "price": "₹26250",
    "status": "Pending",
    "partner": "Divya Sen",
    "date": "16 Jun 2024"
  },
  {
    "id": "ORD-2024-50016",
    "customer": "Rahul Verma",
    "device": "Galaxy Watch 6 (44mm)",
    "price": "₹27000",
    "status": "Assigned",
    "partner": "Amit Connor",
    "date": "17 Jun 2024"
  },
  {
    "id": "ORD-2024-50017",
    "customer": "Priya Singh",
    "device": "iPhone 13 (128GB)",
    "price": "₹27750",
    "status": "Picked Up",
    "partner": "Rahul Mehra",
    "date": "18 Jun 2024"
  },
  {
    "id": "ORD-2024-50018",
    "customer": "Sneha Reddy",
    "device": "iPhone 14 Pro (256GB)",
    "price": "₹28500",
    "status": "Under Inspection",
    "partner": "Priya Gupta",
    "date": "19 Jun 2024"
  },
  {
    "id": "ORD-2024-50019",
    "customer": "Vikram Kapoor",
    "device": "iPhone 15 Pro Max (512GB)",
    "price": "₹29250",
    "status": "Completed",
    "partner": "Sneha Joshi",
    "date": "20 Jun 2024"
  },
  {
    "id": "ORD-2024-50020",
    "customer": "Rohit Kumar",
    "device": "Galaxy S23 Ultra (256GB)",
    "price": "₹30000",
    "status": "Pending",
    "partner": "Vikram Chawla",
    "date": "21 Jun 2024"
  },
  {
    "id": "ORD-2024-50021",
    "customer": "Sanjay Sen",
    "device": "Galaxy S24 (128GB)",
    "price": "₹30750",
    "status": "Assigned",
    "partner": "Rohit Malhotra",
    "date": "22 Jun 2024"
  },
  {
    "id": "ORD-2024-50022",
    "customer": "Manoj Connor",
    "device": "OnePlus 11 5G (256GB)",
    "price": "₹31500",
    "status": "Picked Up",
    "partner": "Sanjay Bose",
    "date": "23 Jun 2024"
  },
  {
    "id": "ORD-2024-50023",
    "customer": "Kunal Mehra",
    "device": "Google Pixel 8 (128GB)",
    "price": "₹32250",
    "status": "Under Inspection",
    "partner": "Manoj Nair",
    "date": "24 Jun 2024"
  },
  {
    "id": "ORD-2024-50024",
    "customer": "Sarah Gupta",
    "device": "MacBook Air M2 (256GB)",
    "price": "₹33000",
    "status": "Completed",
    "partner": "Kunal Sharma",
    "date": "25 Jun 2024"
  },
  {
    "id": "ORD-2024-50025",
    "customer": "Karan Joshi",
    "device": "MacBook Pro M3 (512GB)",
    "price": "₹33750",
    "status": "Pending",
    "partner": "Sarah Patel",
    "date": "26 Jun 2024"
  },
  {
    "id": "ORD-2024-50026",
    "customer": "Aditya Chawla",
    "device": "Dell XPS 13 (512GB)",
    "price": "₹34500",
    "status": "Assigned",
    "partner": "Karan Verma",
    "date": "27 Jun 2024"
  },
  {
    "id": "ORD-2024-50027",
    "customer": "Neha Malhotra",
    "device": "ThinkPad X1 Carbon (1TB)",
    "price": "₹35250",
    "status": "Picked Up",
    "partner": "Aditya Singh",
    "date": "28 Jun 2024"
  },
  {
    "id": "ORD-2024-50028",
    "customer": "Rohan Bose",
    "device": "iPad Air 5 (64GB)",
    "price": "₹36000",
    "status": "Under Inspection",
    "partner": "Neha Reddy",
    "date": "1 Jun 2024"
  },
  {
    "id": "ORD-2024-50029",
    "customer": "Anjali Nair",
    "device": "iPad Pro M2 (256GB)",
    "price": "₹36750",
    "status": "Completed",
    "partner": "Rohan Kapoor",
    "date": "2 Jun 2024"
  },
  {
    "id": "ORD-2024-50030",
    "customer": "Deepak Sharma",
    "device": "Galaxy Tab S9 (128GB)",
    "price": "₹37500",
    "status": "Pending",
    "partner": "Anjali Kumar",
    "date": "3 Jun 2024"
  },
  {
    "id": "ORD-2024-50031",
    "customer": "Vijay Patel",
    "device": "Apple Watch S9 (45mm)",
    "price": "₹38250",
    "status": "Assigned",
    "partner": "Deepak Sen",
    "date": "4 Jun 2024"
  },
  {
    "id": "ORD-2024-50032",
    "customer": "Rajesh Verma",
    "device": "Apple Watch Ultra 2 (49mm)",
    "price": "₹39000",
    "status": "Picked Up",
    "partner": "Vijay Connor",
    "date": "5 Jun 2024"
  },
  {
    "id": "ORD-2024-50033",
    "customer": "Suresh Singh",
    "device": "Galaxy Watch 6 (44mm)",
    "price": "₹39750",
    "status": "Under Inspection",
    "partner": "Rajesh Mehra",
    "date": "6 Jun 2024"
  },
  {
    "id": "ORD-2024-50034",
    "customer": "Divya Reddy",
    "device": "iPhone 13 (128GB)",
    "price": "₹40500",
    "status": "Completed",
    "partner": "Suresh Gupta",
    "date": "7 Jun 2024"
  },
  {
    "id": "ORD-2024-50035",
    "customer": "Amit Kapoor",
    "device": "iPhone 14 Pro (256GB)",
    "price": "₹41250",
    "status": "Pending",
    "partner": "Divya Joshi",
    "date": "8 Jun 2024"
  },
  {
    "id": "ORD-2024-50036",
    "customer": "Rahul Kumar",
    "device": "iPhone 15 Pro Max (512GB)",
    "price": "₹42000",
    "status": "Assigned",
    "partner": "Amit Chawla",
    "date": "9 Jun 2024"
  },
  {
    "id": "ORD-2024-50037",
    "customer": "Priya Sen",
    "device": "Galaxy S23 Ultra (256GB)",
    "price": "₹42750",
    "status": "Picked Up",
    "partner": "Rahul Malhotra",
    "date": "10 Jun 2024"
  },
  {
    "id": "ORD-2024-50038",
    "customer": "Sneha Connor",
    "device": "Galaxy S24 (128GB)",
    "price": "₹43500",
    "status": "Under Inspection",
    "partner": "Priya Bose",
    "date": "11 Jun 2024"
  },
  {
    "id": "ORD-2024-50039",
    "customer": "Vikram Mehra",
    "device": "OnePlus 11 5G (256GB)",
    "price": "₹44250",
    "status": "Completed",
    "partner": "Sneha Nair",
    "date": "12 Jun 2024"
  },
  {
    "id": "ORD-2024-50040",
    "customer": "Rohit Gupta",
    "device": "Google Pixel 8 (128GB)",
    "price": "₹45000",
    "status": "Pending",
    "partner": "Vikram Sharma",
    "date": "13 Jun 2024"
  },
  {
    "id": "ORD-2024-50041",
    "customer": "Sanjay Joshi",
    "device": "MacBook Air M2 (256GB)",
    "price": "₹45750",
    "status": "Assigned",
    "partner": "Rohit Patel",
    "date": "14 Jun 2024"
  },
  {
    "id": "ORD-2024-50042",
    "customer": "Manoj Chawla",
    "device": "MacBook Pro M3 (512GB)",
    "price": "₹46500",
    "status": "Picked Up",
    "partner": "Sanjay Verma",
    "date": "15 Jun 2024"
  },
  {
    "id": "ORD-2024-50043",
    "customer": "Kunal Malhotra",
    "device": "Dell XPS 13 (512GB)",
    "price": "₹47250",
    "status": "Under Inspection",
    "partner": "Manoj Singh",
    "date": "16 Jun 2024"
  },
  {
    "id": "ORD-2024-50044",
    "customer": "Sarah Bose",
    "device": "ThinkPad X1 Carbon (1TB)",
    "price": "₹48000",
    "status": "Completed",
    "partner": "Kunal Reddy",
    "date": "17 Jun 2024"
  },
  {
    "id": "ORD-2024-50045",
    "customer": "Karan Nair",
    "device": "iPad Air 5 (64GB)",
    "price": "₹48750",
    "status": "Pending",
    "partner": "Sarah Kapoor",
    "date": "18 Jun 2024"
  },
  {
    "id": "ORD-2024-50046",
    "customer": "Aditya Sharma",
    "device": "iPad Pro M2 (256GB)",
    "price": "₹49500",
    "status": "Assigned",
    "partner": "Karan Kumar",
    "date": "19 Jun 2024"
  },
  {
    "id": "ORD-2024-50047",
    "customer": "Neha Patel",
    "device": "Galaxy Tab S9 (128GB)",
    "price": "₹50250",
    "status": "Picked Up",
    "partner": "Aditya Sen",
    "date": "20 Jun 2024"
  },
  {
    "id": "ORD-2024-50048",
    "customer": "Rohan Verma",
    "device": "Apple Watch S9 (45mm)",
    "price": "₹51000",
    "status": "Under Inspection",
    "partner": "Neha Connor",
    "date": "21 Jun 2024"
  },
  {
    "id": "ORD-2024-50049",
    "customer": "Anjali Singh",
    "device": "Apple Watch Ultra 2 (49mm)",
    "price": "₹51750",
    "status": "Completed",
    "partner": "Rohan Mehra",
    "date": "22 Jun 2024"
  },
  {
    "id": "ORD-2024-50050",
    "customer": "Deepak Reddy",
    "device": "Galaxy Watch 6 (44mm)",
    "price": "₹52500",
    "status": "Pending",
    "partner": "Anjali Gupta",
    "date": "23 Jun 2024"
  },
  {
    "id": "ORD-2024-50051",
    "customer": "Vijay Kapoor",
    "device": "iPhone 13 (128GB)",
    "price": "₹53250",
    "status": "Assigned",
    "partner": "Deepak Joshi",
    "date": "24 Jun 2024"
  },
  {
    "id": "ORD-2024-50052",
    "customer": "Rajesh Kumar",
    "device": "iPhone 14 Pro (256GB)",
    "price": "₹54000",
    "status": "Picked Up",
    "partner": "Vijay Chawla",
    "date": "25 Jun 2024"
  },
  {
    "id": "ORD-2024-50053",
    "customer": "Suresh Sen",
    "device": "iPhone 15 Pro Max (512GB)",
    "price": "₹54750",
    "status": "Under Inspection",
    "partner": "Rajesh Malhotra",
    "date": "26 Jun 2024"
  },
  {
    "id": "ORD-2024-50054",
    "customer": "Divya Connor",
    "device": "Galaxy S23 Ultra (256GB)",
    "price": "₹55500",
    "status": "Completed",
    "partner": "Suresh Bose",
    "date": "27 Jun 2024"
  },
  {
    "id": "ORD-2024-50055",
    "customer": "Amit Mehra",
    "device": "Galaxy S24 (128GB)",
    "price": "₹56250",
    "status": "Pending",
    "partner": "Divya Nair",
    "date": "28 Jun 2024"
  },
  {
    "id": "ORD-2024-50056",
    "customer": "Rahul Gupta",
    "device": "OnePlus 11 5G (256GB)",
    "price": "₹57000",
    "status": "Assigned",
    "partner": "Amit Sharma",
    "date": "1 Jun 2024"
  },
  {
    "id": "ORD-2024-50057",
    "customer": "Priya Joshi",
    "device": "Google Pixel 8 (128GB)",
    "price": "₹57750",
    "status": "Picked Up",
    "partner": "Rahul Patel",
    "date": "2 Jun 2024"
  },
  {
    "id": "ORD-2024-50058",
    "customer": "Sneha Chawla",
    "device": "MacBook Air M2 (256GB)",
    "price": "₹58500",
    "status": "Under Inspection",
    "partner": "Priya Verma",
    "date": "3 Jun 2024"
  },
  {
    "id": "ORD-2024-50059",
    "customer": "Vikram Malhotra",
    "device": "MacBook Pro M3 (512GB)",
    "price": "₹59250",
    "status": "Completed",
    "partner": "Sneha Singh",
    "date": "4 Jun 2024"
  },
  {
    "id": "ORD-2024-50060",
    "customer": "Rohit Bose",
    "device": "Dell XPS 13 (512GB)",
    "price": "₹60000",
    "status": "Pending",
    "partner": "Vikram Reddy",
    "date": "5 Jun 2024"
  },
  {
    "id": "ORD-2024-50061",
    "customer": "Sanjay Nair",
    "device": "ThinkPad X1 Carbon (1TB)",
    "price": "₹60750",
    "status": "Assigned",
    "partner": "Rohit Kapoor",
    "date": "6 Jun 2024"
  },
  {
    "id": "ORD-2024-50062",
    "customer": "Manoj Sharma",
    "device": "iPad Air 5 (64GB)",
    "price": "₹61500",
    "status": "Picked Up",
    "partner": "Sanjay Kumar",
    "date": "7 Jun 2024"
  },
  {
    "id": "ORD-2024-50063",
    "customer": "Kunal Patel",
    "device": "iPad Pro M2 (256GB)",
    "price": "₹62250",
    "status": "Under Inspection",
    "partner": "Manoj Sen",
    "date": "8 Jun 2024"
  },
  {
    "id": "ORD-2024-50064",
    "customer": "Sarah Verma",
    "device": "Galaxy Tab S9 (128GB)",
    "price": "₹63000",
    "status": "Completed",
    "partner": "Kunal Connor",
    "date": "9 Jun 2024"
  },
  {
    "id": "ORD-2024-50065",
    "customer": "Karan Singh",
    "device": "Apple Watch S9 (45mm)",
    "price": "₹63750",
    "status": "Pending",
    "partner": "Sarah Mehra",
    "date": "10 Jun 2024"
  },
  {
    "id": "ORD-2024-50066",
    "customer": "Aditya Reddy",
    "device": "Apple Watch Ultra 2 (49mm)",
    "price": "₹64500",
    "status": "Assigned",
    "partner": "Karan Gupta",
    "date": "11 Jun 2024"
  },
  {
    "id": "ORD-2024-50067",
    "customer": "Neha Kapoor",
    "device": "Galaxy Watch 6 (44mm)",
    "price": "₹65250",
    "status": "Picked Up",
    "partner": "Aditya Joshi",
    "date": "12 Jun 2024"
  },
  {
    "id": "ORD-2024-50068",
    "customer": "Rohan Kumar",
    "device": "iPhone 13 (128GB)",
    "price": "₹66000",
    "status": "Under Inspection",
    "partner": "Neha Chawla",
    "date": "13 Jun 2024"
  },
  {
    "id": "ORD-2024-50069",
    "customer": "Anjali Sen",
    "device": "iPhone 14 Pro (256GB)",
    "price": "₹66750",
    "status": "Completed",
    "partner": "Rohan Malhotra",
    "date": "14 Jun 2024"
  },
  {
    "id": "ORD-2024-50070",
    "customer": "Deepak Connor",
    "device": "iPhone 15 Pro Max (512GB)",
    "price": "₹67500",
    "status": "Pending",
    "partner": "Anjali Bose",
    "date": "15 Jun 2024"
  },
  {
    "id": "ORD-2024-50071",
    "customer": "Vijay Mehra",
    "device": "Galaxy S23 Ultra (256GB)",
    "price": "₹68250",
    "status": "Assigned",
    "partner": "Deepak Nair",
    "date": "16 Jun 2024"
  },
  {
    "id": "ORD-2024-50072",
    "customer": "Rajesh Gupta",
    "device": "Galaxy S24 (128GB)",
    "price": "₹69000",
    "status": "Picked Up",
    "partner": "Vijay Sharma",
    "date": "17 Jun 2024"
  },
  {
    "id": "ORD-2024-50073",
    "customer": "Suresh Joshi",
    "device": "OnePlus 11 5G (256GB)",
    "price": "₹69750",
    "status": "Under Inspection",
    "partner": "Rajesh Patel",
    "date": "18 Jun 2024"
  },
  {
    "id": "ORD-2024-50074",
    "customer": "Divya Chawla",
    "device": "Google Pixel 8 (128GB)",
    "price": "₹70500",
    "status": "Completed",
    "partner": "Suresh Verma",
    "date": "19 Jun 2024"
  },
  {
    "id": "ORD-2024-50075",
    "customer": "Amit Malhotra",
    "device": "MacBook Air M2 (256GB)",
    "price": "₹71250",
    "status": "Pending",
    "partner": "Divya Singh",
    "date": "20 Jun 2024"
  },
  {
    "id": "ORD-2024-50076",
    "customer": "Rahul Bose",
    "device": "MacBook Pro M3 (512GB)",
    "price": "₹72000",
    "status": "Assigned",
    "partner": "Amit Reddy",
    "date": "21 Jun 2024"
  },
  {
    "id": "ORD-2024-50077",
    "customer": "Priya Nair",
    "device": "Dell XPS 13 (512GB)",
    "price": "₹72750",
    "status": "Picked Up",
    "partner": "Rahul Kapoor",
    "date": "22 Jun 2024"
  },
  {
    "id": "ORD-2024-50078",
    "customer": "Sneha Sharma",
    "device": "ThinkPad X1 Carbon (1TB)",
    "price": "₹73500",
    "status": "Under Inspection",
    "partner": "Priya Kumar",
    "date": "23 Jun 2024"
  },
  {
    "id": "ORD-2024-50079",
    "customer": "Vikram Patel",
    "device": "iPad Air 5 (64GB)",
    "price": "₹74250",
    "status": "Completed",
    "partner": "Sneha Sen",
    "date": "24 Jun 2024"
  },
  {
    "id": "ORD-2024-50080",
    "customer": "Rohit Verma",
    "device": "iPad Pro M2 (256GB)",
    "price": "₹75000",
    "status": "Pending",
    "partner": "Vikram Connor",
    "date": "25 Jun 2024"
  },
  {
    "id": "ORD-2024-50081",
    "customer": "Sanjay Singh",
    "device": "Galaxy Tab S9 (128GB)",
    "price": "₹75750",
    "status": "Assigned",
    "partner": "Rohit Mehra",
    "date": "26 Jun 2024"
  },
  {
    "id": "ORD-2024-50082",
    "customer": "Manoj Reddy",
    "device": "Apple Watch S9 (45mm)",
    "price": "₹76500",
    "status": "Picked Up",
    "partner": "Sanjay Gupta",
    "date": "27 Jun 2024"
  },
  {
    "id": "ORD-2024-50083",
    "customer": "Kunal Kapoor",
    "device": "Apple Watch Ultra 2 (49mm)",
    "price": "₹77250",
    "status": "Under Inspection",
    "partner": "Manoj Joshi",
    "date": "28 Jun 2024"
  },
  {
    "id": "ORD-2024-50084",
    "customer": "Sarah Kumar",
    "device": "Galaxy Watch 6 (44mm)",
    "price": "₹78000",
    "status": "Completed",
    "partner": "Kunal Chawla",
    "date": "1 Jun 2024"
  },
  {
    "id": "ORD-2024-50085",
    "customer": "Karan Sen",
    "device": "iPhone 13 (128GB)",
    "price": "₹78750",
    "status": "Pending",
    "partner": "Sarah Malhotra",
    "date": "2 Jun 2024"
  },
  {
    "id": "ORD-2024-50086",
    "customer": "Aditya Connor",
    "device": "iPhone 14 Pro (256GB)",
    "price": "₹79500",
    "status": "Assigned",
    "partner": "Karan Bose",
    "date": "3 Jun 2024"
  },
  {
    "id": "ORD-2024-50087",
    "customer": "Neha Mehra",
    "device": "iPhone 15 Pro Max (512GB)",
    "price": "₹80250",
    "status": "Picked Up",
    "partner": "Aditya Nair",
    "date": "4 Jun 2024"
  },
  {
    "id": "ORD-2024-50088",
    "customer": "Rohan Gupta",
    "device": "Galaxy S23 Ultra (256GB)",
    "price": "₹81000",
    "status": "Under Inspection",
    "partner": "Neha Sharma",
    "date": "5 Jun 2024"
  },
  {
    "id": "ORD-2024-50089",
    "customer": "Anjali Joshi",
    "device": "Galaxy S24 (128GB)",
    "price": "₹81750",
    "status": "Completed",
    "partner": "Rohan Patel",
    "date": "6 Jun 2024"
  },
  {
    "id": "ORD-2024-50090",
    "customer": "Deepak Chawla",
    "device": "OnePlus 11 5G (256GB)",
    "price": "₹82500",
    "status": "Pending",
    "partner": "Anjali Verma",
    "date": "7 Jun 2024"
  },
  {
    "id": "ORD-2024-50091",
    "customer": "Vijay Malhotra",
    "device": "Google Pixel 8 (128GB)",
    "price": "₹83250",
    "status": "Assigned",
    "partner": "Deepak Singh",
    "date": "8 Jun 2024"
  },
  {
    "id": "ORD-2024-50092",
    "customer": "Rajesh Bose",
    "device": "MacBook Air M2 (256GB)",
    "price": "₹84000",
    "status": "Picked Up",
    "partner": "Vijay Reddy",
    "date": "9 Jun 2024"
  },
  {
    "id": "ORD-2024-50093",
    "customer": "Suresh Nair",
    "device": "MacBook Pro M3 (512GB)",
    "price": "₹84750",
    "status": "Under Inspection",
    "partner": "Rajesh Kapoor",
    "date": "10 Jun 2024"
  },
  {
    "id": "ORD-2024-50094",
    "customer": "Divya Sharma",
    "device": "Dell XPS 13 (512GB)",
    "price": "₹85500",
    "status": "Completed",
    "partner": "Suresh Kumar",
    "date": "11 Jun 2024"
  },
  {
    "id": "ORD-2024-50095",
    "customer": "Amit Patel",
    "device": "ThinkPad X1 Carbon (1TB)",
    "price": "₹86250",
    "status": "Pending",
    "partner": "Divya Sen",
    "date": "12 Jun 2024"
  },
  {
    "id": "ORD-2024-50096",
    "customer": "Rahul Verma",
    "device": "iPad Air 5 (64GB)",
    "price": "₹87000",
    "status": "Assigned",
    "partner": "Amit Connor",
    "date": "13 Jun 2024"
  },
  {
    "id": "ORD-2024-50097",
    "customer": "Priya Singh",
    "device": "iPad Pro M2 (256GB)",
    "price": "₹87750",
    "status": "Picked Up",
    "partner": "Rahul Mehra",
    "date": "14 Jun 2024"
  },
  {
    "id": "ORD-2024-50098",
    "customer": "Sneha Reddy",
    "device": "Galaxy Tab S9 (128GB)",
    "price": "₹88500",
    "status": "Under Inspection",
    "partner": "Priya Gupta",
    "date": "15 Jun 2024"
  },
  {
    "id": "ORD-2024-50099",
    "customer": "Vikram Kapoor",
    "device": "Apple Watch S9 (45mm)",
    "price": "₹89250",
    "status": "Completed",
    "partner": "Sneha Joshi",
    "date": "16 Jun 2024"
  },
  {
    "id": "ORD-2024-50100",
    "customer": "Rohit Kumar",
    "device": "Apple Watch Ultra 2 (49mm)",
    "price": "₹90000",
    "status": "Pending",
    "partner": "Vikram Chawla",
    "date": "17 Jun 2024"
  },
  {
    "id": "ORD-2024-50101",
    "customer": "Sanjay Sen",
    "device": "Galaxy Watch 6 (44mm)",
    "price": "₹90750",
    "status": "Assigned",
    "partner": "Rohit Malhotra",
    "date": "18 Jun 2024"
  },
  {
    "id": "ORD-2024-50102",
    "customer": "Manoj Connor",
    "device": "iPhone 13 (128GB)",
    "price": "₹91500",
    "status": "Picked Up",
    "partner": "Sanjay Bose",
    "date": "19 Jun 2024"
  },
  {
    "id": "ORD-2024-50103",
    "customer": "Kunal Mehra",
    "device": "iPhone 14 Pro (256GB)",
    "price": "₹92250",
    "status": "Under Inspection",
    "partner": "Manoj Nair",
    "date": "20 Jun 2024"
  },
  {
    "id": "ORD-2024-50104",
    "customer": "Sarah Gupta",
    "device": "iPhone 15 Pro Max (512GB)",
    "price": "₹93000",
    "status": "Completed",
    "partner": "Kunal Sharma",
    "date": "21 Jun 2024"
  },
  {
    "id": "ORD-2024-50105",
    "customer": "Karan Joshi",
    "device": "Galaxy S23 Ultra (256GB)",
    "price": "₹93750",
    "status": "Pending",
    "partner": "Vikram Connor",
    "date": "22 Jun 2024"
  },
  {
    "id": "ORD-2024-50106",
    "customer": "Aditya Chawla",
    "device": "Galaxy S24 (128GB)",
    "price": "₹94500",
    "status": "Assigned",
    "partner": "Rohit Mehra",
    "date": "23 Jun 2024"
  },
  {
    "id": "ORD-2024-50107",
    "customer": "Neha Malhotra",
    "device": "OnePlus 11 5G (256GB)",
    "price": "₹95250",
    "status": "Picked Up",
    "partner": "Sanjay Gupta",
    "date": "24 Jun 2024"
  },
  {
    "id": "ORD-2024-50108",
    "customer": "Rohan Bose",
    "device": "Google Pixel 8 (128GB)",
    "price": "₹96000",
    "status": "Under Inspection",
    "partner": "Manoj Joshi",
    "date": "25 Jun 2024"
  },
  {
    "id": "ORD-2024-50109",
    "customer": "Anjali Nair",
    "device": "MacBook Air M2 (256GB)",
    "price": "₹96750",
    "status": "Completed",
    "partner": "Kunal Chawla",
    "date": "26 Jun 2024"
  },
  {
    "id": "ORD-2024-50110",
    "customer": "Deepak Sharma",
    "device": "MacBook Pro M3 (512GB)",
    "price": "₹97500",
    "status": "Pending",
    "partner": "Sarah Malhotra",
    "date": "27 Jun 2024"
  },
  {
    "id": "ORD-2024-50111",
    "customer": "Vijay Patel",
    "device": "Dell XPS 13 (512GB)",
    "price": "₹98250",
    "status": "Assigned",
    "partner": "Karan Bose",
    "date": "28 Jun 2024"
  },
  {
    "id": "ORD-2024-50112",
    "customer": "Rajesh Verma",
    "device": "ThinkPad X1 Carbon (1TB)",
    "price": "₹99000",
    "status": "Picked Up",
    "partner": "Aditya Nair",
    "date": "1 Jun 2024"
  },
  {
    "id": "ORD-2024-50113",
    "customer": "Suresh Singh",
    "device": "iPad Air 5 (64GB)",
    "price": "₹99750",
    "status": "Under Inspection",
    "partner": "Neha Sharma",
    "date": "2 Jun 2024"
  },
  {
    "id": "ORD-2024-50114",
    "customer": "Divya Reddy",
    "device": "iPad Pro M2 (256GB)",
    "price": "₹100500",
    "status": "Completed",
    "partner": "Rohan Patel",
    "date": "3 Jun 2024"
  },
  {
    "id": "ORD-2024-50115",
    "customer": "Amit Kapoor",
    "device": "Galaxy Tab S9 (128GB)",
    "price": "₹101250",
    "status": "Pending",
    "partner": "Anjali Verma",
    "date": "4 Jun 2024"
  },
  {
    "id": "ORD-2024-50116",
    "customer": "Rahul Kumar",
    "device": "Apple Watch S9 (45mm)",
    "price": "₹102000",
    "status": "Assigned",
    "partner": "Deepak Singh",
    "date": "5 Jun 2024"
  },
  {
    "id": "ORD-2024-50117",
    "customer": "Priya Sen",
    "device": "Apple Watch Ultra 2 (49mm)",
    "price": "₹102750",
    "status": "Picked Up",
    "partner": "Vijay Reddy",
    "date": "6 Jun 2024"
  },
  {
    "id": "ORD-2024-50118",
    "customer": "Sneha Connor",
    "device": "Galaxy Watch 6 (44mm)",
    "price": "₹103500",
    "status": "Under Inspection",
    "partner": "Rajesh Kapoor",
    "date": "7 Jun 2024"
  },
  {
    "id": "ORD-2024-50119",
    "customer": "Vikram Mehra",
    "device": "iPhone 13 (128GB)",
    "price": "₹104250",
    "status": "Completed",
    "partner": "Suresh Kumar",
    "date": "8 Jun 2024"
  },
  {
    "id": "ORD-2024-50120",
    "customer": "Rohit Gupta",
    "device": "iPhone 14 Pro (256GB)",
    "price": "₹105000",
    "status": "Pending",
    "partner": "Divya Sen",
    "date": "9 Jun 2024"
  }
];

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState<string>('');

  const loadData = () => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const combined = [...data];
          ordersList.forEach(mockOrder => {
            if (!combined.some(o => o.id === mockOrder.id)) {
              combined.push(mockOrder);
            }
          });
          
          // Sort: newest first based on timestamp (fallback to ID compare for mock data)
          combined.sort((a, b) => {
            const timeA = a.timestamp || 0;
            const timeB = b.timestamp || 0;
            if (timeA && timeB) return timeB - timeA;
            if (timeA) return -1;
            if (timeB) return 1;
            return b.id.localeCompare(a.id);
          });

          setOrders(combined);
        } else {
          setOrders(ordersList);
        }
      })
      .catch(err => {
        console.log('Error loading dynamic orders:', err);
        setOrders(ordersList);
      });

    fetch('/api/partners')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPartners(data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    const updatedOrder = { ...orderToUpdate, status: newStatus };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedOrder })
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        
        // Notify Customer & Partner of status change
        const targetPhone = orderToUpdate.customerPhone || orderToUpdate.phone || '+91 98765 43210';
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            item: {
              id: `NTF-${Date.now()}-upd-cust`,
              target: targetPhone,
              message: `Your order ${orderId} status has been updated to: ${newStatus}`,
              read: false,
              date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            }
          })
        });

        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            item: {
              id: `NTF-${Date.now()}-upd-part`,
              target: 'partner',
              message: `Order ${orderId} status updated to: ${newStatus}`,
              read: false,
              date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            }
          })
        });
      } else {
        const createRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', item: updatedOrder })
        });
        const createData = await createRes.json();
        if (createData.success) {
          setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(updatedOrder);
          }
        }
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleAssignPartner = async () => {
    if (!selectedOrder || !selectedPartnerName) return;

    const updatedOrder = { 
      ...selectedOrder, 
      partner: selectedPartnerName, 
      status: 'Assigned' 
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', item: updatedOrder })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));
        setSelectedOrder(updatedOrder);
        alert(`Order successfully assigned to ${selectedPartnerName}!`);
        
        // Notify partner
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            item: {
              id: `NTF-${Date.now()}-assign`,
              target: 'partner',
              message: `New buyback pickup assigned: ${selectedOrder.id} for ${selectedOrder.device}`,
              read: false,
              date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            }
          })
        });
      } else {
        // Create if it doesn't exist
        const createRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', item: updatedOrder })
        });
        const createData = await createRes.json();
        if (createData.success) {
          setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));
          setSelectedOrder(updatedOrder);
          alert(`Order successfully assigned to ${selectedPartnerName}!`);
        }
      }
    } catch (e) {
      console.error('Failed to assign partner:', e);
      alert('Error assigning partner.');
    }
  };

  const filtered = orders.filter(o => 
    (o.id || '').toLowerCase().includes(search.toLowerCase()) || 
    (o.customer || o.customerName || '').toLowerCase().includes(search.toLowerCase()) || 
    (o.device || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Buyback & Refurbished Orders ({filtered.length} Total)</h3>
          <p className="text-xs text-slate-400 font-bold">Manage device buybacks and refurbished purchase dispatch statuses</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadData}
            className="p-2 border rounded text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
          >
            🔄 Refresh
          </button>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="p-2 border rounded text-xs w-64 bg-white"
          />
        </div>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Device</th>
              <th className="p-3">Price / Quote</th>
              <th className="p-3">Type</th>
              <th className="p-3">Partner / Delivery</th>
              <th className="p-3">Date Created</th>
              <th className="p-3 text-center">Status Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((o, i) => {
              const customerName = o.customer || o.customerName || 'N/A';
              const partnerName = o.partner || 'N/A (Standard Delivery)';
              const orderType = (o.status === 'Pending Verification' || !o.partner) ? 'Refurbished' : 'Buyback';
              
              return (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900 cursor-pointer" onClick={() => { setSelectedOrder(o); setSelectedPartnerName(o.partner || ''); }}>
                    <span className="hover:underline text-blue-600">{o.id}</span>
                  </td>
                  <td className="p-3 font-bold cursor-pointer" onClick={() => { setSelectedOrder(o); setSelectedPartnerName(o.partner || ''); }}>{customerName}</td>
                  <td className="p-3 text-slate-500 cursor-pointer" onClick={() => { setSelectedOrder(o); setSelectedPartnerName(o.partner || ''); }}>{o.device}</td>
                  <td className="p-3 font-black text-slate-700 cursor-pointer" onClick={() => { setSelectedOrder(o); setSelectedPartnerName(o.partner || ''); }}>{o.price}</td>
                  <td className="p-3 cursor-pointer" onClick={() => { setSelectedOrder(o); setSelectedPartnerName(o.partner || ''); }}>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                      orderType === 'Refurbished' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {orderType}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 cursor-pointer" onClick={() => { setSelectedOrder(o); setSelectedPartnerName(o.partner || ''); }}>{partnerName}</td>
                  <td className="p-3 text-slate-400 cursor-pointer" onClick={() => { setSelectedOrder(o); setSelectedPartnerName(o.partner || ''); }}>{o.date}</td>
                  <td className="p-3 text-center">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                      className={`px-2 py-1 rounded-lg font-bold text-[10px] bg-white border border-slate-200 focus:outline-none cursor-pointer focus:border-[#39b54a] ${
                        o.status === 'Completed' || o.status === 'Delivered' 
                          ? 'text-emerald-600 border-emerald-200 bg-emerald-50/10' 
                          : o.status === 'Pending Verification' || o.status === 'Pending'
                          ? 'text-amber-600 border-amber-200 bg-amber-50/10'
                          : 'text-teal-600 border-teal-200 bg-teal-50/10'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Picked Up">Picked Up</option>
                      <option value="Under Inspection">Under Inspection</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Admin Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 space-y-5 animate-scale-up text-xs text-slate-700">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">{selectedOrder.id}</span>
                <h4 className="font-black text-slate-800 text-sm mt-1">Admin Order Control Panel</h4>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold transition flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-semibold space-y-2">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Customer Contact Info</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px]">Customer Name</span>
                    <p className="text-slate-800 font-black">{selectedOrder.customer || selectedOrder.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Phone Number</span>
                    <p className="text-slate-800 font-bold">{selectedOrder.customerPhone || selectedOrder.phone || '+91 98765 43210'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[10px]">Full Address</span>
                    <p className="text-slate-800 font-bold">📍 {selectedOrder.customerAddress || selectedOrder.address || 'No address details provided.'}</p>
                  </div>
                </div>
              </div>

              {/* Order & Status Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-semibold space-y-2">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Device Details</span>
                  <div>
                    <span className="text-slate-400 text-[10px]">Model Name</span>
                    <p className="text-slate-800 font-black">{selectedOrder.device || selectedOrder.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 text-[10px]">Price / Quote</span>
                      <p className="text-emerald-600 font-black">{selectedOrder.price}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Date Created</span>
                      <p className="text-slate-800 font-bold">{selectedOrder.date}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-semibold space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Assignment & Status</span>
                    <div className="mt-2">
                      <span className="text-slate-400 text-[10px]">Current Status</span>
                      <div className="mt-1">
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                          className="px-2 py-1 rounded-lg font-bold text-[10px] bg-white border border-slate-200 focus:outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Pending Verification">Pending Verification</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Picked Up">Picked Up</option>
                          <option value="Under Inspection">Under Inspection</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px]">Assigned Partner / Vendor</span>
                    <p className="text-slate-800 font-black">{selectedOrder.partner || 'N/A (Standard Delivery)'}</p>
                  </div>
                </div>
              </div>

              {/* Vendor Assignment Panel */}
              <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 font-semibold space-y-2">
                <span className="text-[10px] text-[#39b54a] block uppercase font-black">Direct Vendor Assignment Panel</span>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <span className="text-slate-400 text-[10px] block mb-1">Select Partner/Vendor</span>
                    <select
                      value={selectedPartnerName}
                      onChange={(e) => setSelectedPartnerName(e.target.value)}
                      className="w-full p-2 bg-white border rounded-xl text-xs focus:outline-none focus:border-[#39b54a]"
                    >
                      <option value="">-- Choose Partner/Vendor --</option>
                      {partners.map(p => (
                        <option key={p.id} value={p.name}>{p.name} ({p.location || 'Unknown location'})</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAssignPartner}
                    disabled={!selectedPartnerName}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs shadow-3xs transition-all ${
                      !selectedPartnerName 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-[#39b54a] hover:bg-[#2fa03e] text-white cursor-pointer'
                    }`}
                  >
                    Assign Partner
                  </button>
                </div>
              </div>

              {/* User Diagnostics Appraisal Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-semibold space-y-2">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">User Diagnostics Appraisal Answers</span>
                {selectedOrder.answers && Object.keys(selectedOrder.answers).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {Object.keys(selectedOrder.answers).map((qText) => (
                      <div key={qText} className="flex justify-between border-b pb-1 last:border-b-0 text-[10px]">
                        <span className="text-slate-500 font-semibold truncate max-w-[160px]" title={qText}>{qText}</span>
                        <span className={`font-black uppercase text-[8px] px-1.5 py-0.2 rounded shrink-0 ${
                          selectedOrder.answers[qText] === 'Perfect' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>{selectedOrder.answers[qText]}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-450 italic font-semibold">No diagnostic assessment answers recorded yet.</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-center transition cursor-pointer"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
