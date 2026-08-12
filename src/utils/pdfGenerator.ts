import type { FormState, PreApprovalResult } from '../types/loanForm';

/**
 * Triggers browser print-to-PDF dialog with a styled Pre-Approval Approval Letter
 */
export function generatePreApprovalPDF(state: FormState, preApproval: PreApprovalResult): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download/print your Pre-Approval Summary.');
    return;
  }

  const { step1, step2, step3, step4, step6 } = state;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Pre-Approval Letter - ${preApproval.applicationId}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 40px; background: #fff; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #026fc7; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: 800; color: #026fc7; letter-spacing: -0.5px; }
        .logo span { color: #f59e0b; }
        .badge { background: #e0effe; color: #0358a1; font-weight: 700; padding: 6px 14px; border-radius: 20px; font-size: 14px; text-transform: uppercase; }
        .title { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
        .card { background: #f8fafc; border: 1fr solid #e2e8f0; border-radius: 8px; padding: 18px; }
        .card h4 { margin: 0 0 10px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .card p { margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; }
        .table th, .table td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; text-align: left; font-size: 14px; }
        .table th { background: #f1f5f9; color: #475569; font-weight: 600; }
        .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center; }
        .stamp { display: inline-block; border: 2px dashed #10b981; color: #10b981; font-weight: 800; padding: 8px 16px; border-radius: 6px; transform: rotate(-3deg); font-size: 14px; margin-top: 15px; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">ZETHETA <span>WORKBRIDGE</span></div>
        <div class="badge">${preApproval.status.replace('_', ' ')}</div>
      </div>

      <div class="title">OFFICIAL LOAN PRE-APPROVAL LETTER</div>
      <p style="color: #64748b; margin-top: -5px;">Reference ID: <strong>${preApproval.applicationId}</strong> | Issued: ${new Date().toLocaleDateString('en-IN')}</p>

      <p>Dear <strong>${step2.fullName || 'Valued Applicant'}</strong>,</p>
      <p>We are pleased to inform you that based on your credit evaluation and digital KYC verification, your loan application has been <strong>${preApproval.status.replace('_', ' ').toUpperCase()}</strong>.</p>

      <div class="grid">
        <div class="card">
          <h4>Approved Loan Amount</h4>
          <p style="color: #026fc7; font-size: 24px;">₹${preApproval.approvedAmount.toLocaleString('en-IN')}</p>
        </div>
        <div class="card">
          <h4>Estimated Monthly EMI</h4>
          <p style="color: #059669; font-size: 24px;">₹${preApproval.monthlyEMI.toLocaleString('en-IN')} / mo</p>
        </div>
        <div class="card">
          <h4>Approved Interest Rate</h4>
          <p>${preApproval.interestRate}% p.a.</p>
        </div>
        <div class="card">
          <h4>Tenure Requested</h4>
          <p>${step1.tenureMonths} Months</p>
        </div>
      </div>

      <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Applicant & Financial Overview</h3>
      <table class="table">
        <tr>
          <th>Loan Type</th>
          <td>${step1.loanType.toUpperCase()} LOAN</td>
          <th>PAN Number</th>
          <td>${step2.panNumber.toUpperCase()} (Verified)</td>
        </tr>
        <tr>
          <th>Mobile & Email</th>
          <td>+91 ${step3.mobile} | ${step3.email}</td>
          <th>Employment Category</th>
          <td>${step4.employmentType.toUpperCase()}</td>
        </tr>
        <tr>
          <th>Net Monthly Income</th>
          <td>₹${step4.netMonthlyIncome.toLocaleString('en-IN')}</td>
          <th>Debt-to-Income FOIR</th>
          <td>${preApproval.debtToIncomeRatio}%</td>
        </tr>
        <tr>
          <th>Disbursement Bank</th>
          <td>${step6.bankName} (${step6.ifscCode})</td>
          <th>Pre-Approval Eligibility Index</th>
          <td><strong>${preApproval.score} / 100</strong></td>
        </tr>
      </table>

      <div style="text-align: right;">
        <div class="stamp">ZETHETA VERIFIED PRE-APPROVAL</div>
      </div>

      <div class="footer">
        This pre-approval offer is digitally signed and valid for 30 days from date of issuance. Final disbursement is subject to physical document verification and final underwriting approval.<br>
        © 2026 Zetheta Algorithms Private Limited. All Rights Reserved. Confidential Document.
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
