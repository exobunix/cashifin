"use client";
import React, { useState } from 'react';

const pickupsList = [
  {
    "orderId": "ORD-2024-50002",
    "slot": "16 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "12, Sector 1, Mumbai",
    "distance": "3.0 KM",
    "partner": "Rohit Mehra",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50003",
    "slot": "17 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "24, Sector 2, Bengaluru",
    "distance": "3.9 KM",
    "partner": "Sanjay Gupta",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50004",
    "slot": "18 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "36, Sector 3, Ahmedabad",
    "distance": "4.8 KM",
    "partner": "Manoj Joshi",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50005",
    "slot": "19 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "48, Sector 4, Kolkata",
    "distance": "5.7 KM",
    "partner": "Kunal Chawla",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50006",
    "slot": "20 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "60, Sector 5, Pune",
    "distance": "6.6 KM",
    "partner": "Sarah Malhotra",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50007",
    "slot": "21 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "72, Sector 6, Hyderabad",
    "distance": "7.5 KM",
    "partner": "Karan Bose",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50008",
    "slot": "22 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "84, Sector 7, Chennai",
    "distance": "8.4 KM",
    "partner": "Aditya Nair",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50009",
    "slot": "23 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "96, Sector 8, New Delhi",
    "distance": "9.3 KM",
    "partner": "Neha Sharma",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50010",
    "slot": "24 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "108, Sector 9, Mumbai",
    "distance": "10.2 KM",
    "partner": "Rohan Patel",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50011",
    "slot": "25 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "120, Sector 10, Bengaluru",
    "distance": "11.1 KM",
    "partner": "Anjali Verma",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50012",
    "slot": "26 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "132, Sector 11, Ahmedabad",
    "distance": "12.0 KM",
    "partner": "Deepak Singh",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50013",
    "slot": "27 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "144, Sector 12, Kolkata",
    "distance": "12.9 KM",
    "partner": "Vijay Reddy",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50014",
    "slot": "28 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "156, Sector 13, Pune",
    "distance": "13.8 KM",
    "partner": "Rajesh Kapoor",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50015",
    "slot": "29 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "168, Sector 14, Hyderabad",
    "distance": "14.7 KM",
    "partner": "Suresh Kumar",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50016",
    "slot": "15 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "180, Sector 15, Chennai",
    "distance": "2.1 KM",
    "partner": "Divya Sen",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50017",
    "slot": "16 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "192, Sector 16, New Delhi",
    "distance": "3.0 KM",
    "partner": "Amit Connor",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50018",
    "slot": "17 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "204, Sector 17, Mumbai",
    "distance": "3.9 KM",
    "partner": "Rahul Mehra",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50019",
    "slot": "18 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "216, Sector 0, Bengaluru",
    "distance": "4.8 KM",
    "partner": "Priya Gupta",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50020",
    "slot": "19 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "228, Sector 1, Ahmedabad",
    "distance": "5.7 KM",
    "partner": "Sneha Joshi",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50021",
    "slot": "20 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "240, Sector 2, Kolkata",
    "distance": "6.6 KM",
    "partner": "Vikram Chawla",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50022",
    "slot": "21 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "252, Sector 3, Pune",
    "distance": "7.5 KM",
    "partner": "Rohit Malhotra",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50023",
    "slot": "22 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "264, Sector 4, Hyderabad",
    "distance": "8.4 KM",
    "partner": "Sanjay Bose",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50024",
    "slot": "23 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "276, Sector 5, Chennai",
    "distance": "9.3 KM",
    "partner": "Manoj Nair",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50025",
    "slot": "24 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "288, Sector 6, New Delhi",
    "distance": "10.2 KM",
    "partner": "Kunal Sharma",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50026",
    "slot": "25 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "300, Sector 7, Mumbai",
    "distance": "11.1 KM",
    "partner": "Sarah Patel",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50027",
    "slot": "26 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "312, Sector 8, Bengaluru",
    "distance": "12.0 KM",
    "partner": "Karan Verma",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50028",
    "slot": "27 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "324, Sector 9, Ahmedabad",
    "distance": "12.9 KM",
    "partner": "Aditya Singh",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50029",
    "slot": "28 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "336, Sector 10, Kolkata",
    "distance": "13.8 KM",
    "partner": "Neha Reddy",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50030",
    "slot": "29 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "348, Sector 11, Pune",
    "distance": "14.7 KM",
    "partner": "Rohan Kapoor",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50031",
    "slot": "15 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "360, Sector 12, Hyderabad",
    "distance": "2.1 KM",
    "partner": "Anjali Kumar",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50032",
    "slot": "16 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "372, Sector 13, Chennai",
    "distance": "3.0 KM",
    "partner": "Deepak Sen",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50033",
    "slot": "17 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "384, Sector 14, New Delhi",
    "distance": "3.9 KM",
    "partner": "Vijay Connor",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50034",
    "slot": "18 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "396, Sector 15, Mumbai",
    "distance": "4.8 KM",
    "partner": "Rajesh Mehra",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50035",
    "slot": "19 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "408, Sector 16, Bengaluru",
    "distance": "5.7 KM",
    "partner": "Suresh Gupta",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50036",
    "slot": "20 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "420, Sector 17, Ahmedabad",
    "distance": "6.6 KM",
    "partner": "Divya Joshi",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50037",
    "slot": "21 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "432, Sector 0, Kolkata",
    "distance": "7.5 KM",
    "partner": "Amit Chawla",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50038",
    "slot": "22 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "444, Sector 1, Pune",
    "distance": "8.4 KM",
    "partner": "Rahul Malhotra",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50039",
    "slot": "23 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "456, Sector 2, Hyderabad",
    "distance": "9.3 KM",
    "partner": "Priya Bose",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50040",
    "slot": "24 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "468, Sector 3, Chennai",
    "distance": "10.2 KM",
    "partner": "Sneha Nair",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50041",
    "slot": "25 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "480, Sector 4, New Delhi",
    "distance": "11.1 KM",
    "partner": "Vikram Sharma",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50042",
    "slot": "26 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "492, Sector 5, Mumbai",
    "distance": "12.0 KM",
    "partner": "Rohit Patel",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50043",
    "slot": "27 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "504, Sector 6, Bengaluru",
    "distance": "12.9 KM",
    "partner": "Sanjay Verma",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50044",
    "slot": "28 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "516, Sector 7, Ahmedabad",
    "distance": "13.8 KM",
    "partner": "Manoj Singh",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50045",
    "slot": "29 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "528, Sector 8, Kolkata",
    "distance": "14.7 KM",
    "partner": "Kunal Reddy",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50046",
    "slot": "15 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "540, Sector 9, Pune",
    "distance": "2.1 KM",
    "partner": "Sarah Kapoor",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50047",
    "slot": "16 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "552, Sector 10, Hyderabad",
    "distance": "3.0 KM",
    "partner": "Karan Kumar",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50048",
    "slot": "17 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "564, Sector 11, Chennai",
    "distance": "3.9 KM",
    "partner": "Aditya Sen",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50049",
    "slot": "18 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "576, Sector 12, New Delhi",
    "distance": "4.8 KM",
    "partner": "Neha Connor",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50050",
    "slot": "19 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "588, Sector 13, Mumbai",
    "distance": "5.7 KM",
    "partner": "Rohan Mehra",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50051",
    "slot": "20 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "600, Sector 14, Bengaluru",
    "distance": "6.6 KM",
    "partner": "Anjali Gupta",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50052",
    "slot": "21 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "612, Sector 15, Ahmedabad",
    "distance": "7.5 KM",
    "partner": "Deepak Joshi",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50053",
    "slot": "22 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "624, Sector 16, Kolkata",
    "distance": "8.4 KM",
    "partner": "Vijay Chawla",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50054",
    "slot": "23 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "636, Sector 17, Pune",
    "distance": "9.3 KM",
    "partner": "Rajesh Malhotra",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50055",
    "slot": "24 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "648, Sector 0, Hyderabad",
    "distance": "10.2 KM",
    "partner": "Suresh Bose",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50056",
    "slot": "25 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "660, Sector 1, Chennai",
    "distance": "11.1 KM",
    "partner": "Divya Nair",
    "status": "Completed"
  },
  {
    "orderId": "ORD-2024-50057",
    "slot": "26 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "672, Sector 2, New Delhi",
    "distance": "12.0 KM",
    "partner": "Amit Sharma",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50058",
    "slot": "27 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "684, Sector 3, Mumbai",
    "distance": "12.9 KM",
    "partner": "Rahul Patel",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50059",
    "slot": "28 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "696, Sector 4, Bengaluru",
    "distance": "13.8 KM",
    "partner": "Priya Verma",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50060",
    "slot": "29 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "708, Sector 5, Ahmedabad",
    "distance": "14.7 KM",
    "partner": "Sneha Singh",
    "status": "Scheduled"
  },
  {
    "orderId": "ORD-2024-50061",
    "slot": "15 Jun 2024, 10:00 AM - 01:00 PM",
    "address": "720, Sector 6, Kolkata",
    "distance": "2.1 KM",
    "partner": "Vikram Reddy",
    "status": "Completed"
  }
];

export default function PickupsPage() {
  const [search, setSearch] = useState('');
  const filtered = pickupsList.filter(p => p.orderId.toLowerCase().includes(search.toLowerCase()) || p.partner.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Pickup Logistics Schedules (60 Pickups)</h3>
          <p className="text-xs text-slate-400">Realtime logistics assignments</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search pickups..."
          className="p-2 border rounded text-xs w-64 bg-white"
        />
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b">
              <th className="p-3">Order ID</th>
              <th className="p-3">Slot Time</th>
              <th className="p-3">Address</th>
              <th className="p-3">Distance</th>
              <th className="p-3">Partner</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{p.orderId}</td>
                <td className="p-3 font-bold">{p.slot}</td>
                <td className="p-3 text-slate-500 max-w-xs truncate">{p.address}</td>
                <td className="p-3 font-semibold text-slate-700">{p.distance}</td>
                <td className="p-3 text-slate-500 font-bold">{p.partner}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
