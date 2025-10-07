// import { projectConfig } from '../../config/config';
// import {
//   capitalizeFirstLetter,
//   formatDateString,
// } from '../../utils/common.utils';
// import { Resend } from 'resend';

// const resend = new Resend(projectConfig.resendToken);
// /**
//  **Sends Temporary password to email
//  * @param purpose
//  * @param subject
//  * @param receiverEmail
//  * @param code
//  * @returns
//  */
// export const sendAuthEmail = async (
//   purpose: string,
//   subject: string,
//   receiverEmail: string,
//   code: string,
// ) => {
//   const message = {
//     from: projectConfig.mailEmail,
//     to: receiverEmail,
//     subject: subject,
//     html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
//           <p>Good day,</p>
//           <p>Your ${purpose} is:</p>
//           <div style="font-size: 24px; font-weight: bold; color:rgb(3, 73, 147); margin: 20px 0;">
//             ${code}
//           </div>
//           <p>If you didn't request this, please ignore this email.</p>
//           <hr />
//           <p style="font-size: 12px; color: #888;">
//             Eleven-V, All rights reserved.
//           </p>
//         </div>
//       `,
//   };

//   try {
//     const info = await resend.emails.send(message);
//     return { success: true, info };
//   } catch (error) {
//     return { success: false, error };
//   }
// };

// /**
//  ** Sends Bill to Email
//  * @param receiverEmail
//  * @param billData
//  * @returns
//  */
// export const sendBillEmail = async (
//   receiverEmail: string,
//   billData: BillData[],
// ): Promise<{ success: boolean; info?: any; error?: any }> => {
//   const billItems = billData
//     .map(
//       (bill) => `
//       <tr>
//         <td style="border: 1px solid #ddd; padding: 6px;">${capitalizeFirstLetter(
//           bill.type_of_bill,
//         )}</td>
//         <td style="border: 1px solid #ddd; padding: 6px;">${
//           bill.past_reading_date
//             ? formatDateString(bill.past_reading_date)
//             : '-'
//         }</td>
//         <td style="border: 1px solid #ddd; padding: 6px;">${
//           bill.past_reading ? bill.past_reading : '-'
//         }</td>
//         <td style="border: 1px solid #ddd; padding: 6px;">${
//           bill.present_reading_date
//             ? formatDateString(bill.present_reading_date)
//             : '-'
//         }</td>
//         <td style="border: 1px solid #ddd; padding: 6px;">${
//           bill.present_reading ? bill.present_reading : '-'
//         }</td>
//         <td style="border: 1px solid #ddd; padding: 6px;">${formatDateString(
//           bill.due_date,
//         )}</td>
//         <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">₱${bill.bill_amount.toLocaleString()}</td>
//       </tr>`,
//     )
//     .join('');

//   const totalAmount = billData.reduce((acc, bill) => acc + bill.bill_amount, 0);

//   const message = {
//     from: projectConfig.mailEmail,
//     to: receiverEmail,
//     subject: `11-V Monthly Bill Reminder`,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
//         <p>Good day,</p>
//         <p>Your monthly bill/s is as follows:</p>
//         <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
//           <thead>
//             <tr>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Type</th>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Past Reading Date</th>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Past Reading</th>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Present Reading Date</th>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Present Reading</th>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Due Date</th>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${billItems}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colspan="6" style="border: 1px solid #ddd; padding: 6px; font-weight: bold; text-align: right;">Total:</td>
//               <td style="border: 1px solid #ddd; padding: 6px; font-weight: bold; text-align: right;">₱${totalAmount.toLocaleString()}</td>
//             </tr>
//           </tfoot>
//         </table>
//         <p>Please settle your bill.</p>
//         <hr />
//         <p style="font-size: 12px; color: #888;">Eleven-V, All rights reserved.</p>
//       </div>
//     `,
//   };

//   try {
//     const info = await resend.emails.send(message);
//     return { success: true, info };
//   } catch (error) {
//     return { success: false, error };
//   }
// };

// /**
//  ** Send Confirmation Payment to Email
//  * @param receiverEmail
//  * @param billData
//  * @returns
//  */
// export const sendConfirmPaymentEmail = async (
//   receiverEmail: string,
//   billData: BillData,
// ) => {
//   const billItems = `<tr>
//         <td style="border: 1px solid #ddd; padding: 6px;">${
//           billData.bill_number
//         }</td>
//         <td style="border: 1px solid #ddd; padding: 6px;">${
//           billData.type_of_bill
//         }</td>
//         <td style="border: 1px solid #ddd; padding: 6px;">${formatDateString(
//           billData.due_date,
//         )}</td>
//         <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">₱${billData.bill_amount.toLocaleString()}</td>
//       </tr>`;

//   const message = {
//     from: projectConfig.mailEmail,
//     to: receiverEmail,
//     subject: `Monthly Bill - Confirmation Payment`,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
//         <p>Good day,</p>
//         <p>Your payment for this bill is confirmed. Details are below:</p>
//         <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
//           <thead>
//             <tr>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Bill No.</th>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Type</th>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Due Date</th>
//               <th style="border: 1px solid #ddd; padding: 6px; background-color: #205072; color: #f4f4f4;">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${billItems}
//           </tbody>
//         </table>
//         <p>.</p>
//         <hr />
//         <p style="font-size: 12px; color: #888;">Eleven-V, All rights reserved.</p>
//       </div>
//     `,
//   };

//   try {
//     const info = await resend.emails.send(message);
//     return { success: true, info };
//   } catch (error) {
//     return { success: false, error };
//   }
// };

// export const sentTestEmail = async (email: string) => {
//   const message = {
//     from: projectConfig.mailEmail,
//     to: email,
//     subject: 'Test Email',
//     html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
//   };
//   try {
//     const info = await resend.emails.send(message);
//     return { success: true, info };
//   } catch (error) {
//     return { success: false, error };
//   }
// };
