const XLSX = require('xlsx');
const fs = require('fs');

// Specify the desired file name
const fileName = 'LandscapeContractors_GreaterMelborne.xlsx';

// Create a new workbook
const wb = XLSX.utils.book_new();

// Define the data to be added to the sheet
const data = [
  ['NameOfCompany', 'Address', 'PhoneNumber', 'email', 'website'],
  ['Company A', '123 Main St', '123-456-7890', 'companya@example.com', 'www.companya.com'],
  ['Company B', '456 Oak Ave', '', 'companyb@example.com', 'www.companyb.com'],
  // Add more rows as needed
];

// Create a new worksheet with the data
const ws = XLSX.utils.aoa_to_sheet(data);

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

// Write the workbook to the specified file
const excelFilePath = fileName;
XLSX.writeFile(wb, excelFilePath);

console.log(`Excel file "${excelFilePath}" created successfully.`);
