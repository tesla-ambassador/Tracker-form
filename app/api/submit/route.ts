import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, lengthOfBooking, dateOfBooking, packageDescription } = body;

        // Format date to be more readable in spreadsheet
        const formattedDate = new Date(dateOfBooking).toLocaleDateString();

        // Prepare the row data
        const row = [
            name,
            email,
            lengthOfBooking,
            formattedDate,
            packageDescription,
            new Date().toISOString(), // Timestamp of submission
        ];

        // Append row to spreadsheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:F', // Adjust range based on your spreadsheet
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit form' },
            { status: 500 }
        );
    }
} 