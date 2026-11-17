const getApplicationAcceptedEmail = (username, projectName, role, ownerName) => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #222; max-width: 480px; margin: 0 auto; padding: 20px 16px;">

      <!-- Branding -->
      <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 22px;">
        Student-Build<span style="color: #6366f1;">.</span>
      </h2>

      <!-- Greeting -->
      <p style="font-size: 14px; margin: 0 0 12px;">
        Hey ${username || "there"},
      </p>

      <p style="font-size: 14px; line-height: 1.6; color: #555; margin: 0 0 18px;">
        Great news! Your application has been accepted. 
        You're one step closer to becoming part of an exciting project.
      </p>

      <!-- Success message -->
      <div style="border: 1px solid #d1fae5; background-color: #f0fdf4; border-radius: 8px; padding: 14px; margin-bottom: 18px;">
        <p style="font-size: 14px; font-weight: 700; color: #15803d; margin: 0 0 6px;">
          ✓ Application Accepted
        </p>
        <p style="font-size: 12px; color: #166534; margin: 0;">
          Congratulations! Your application was approved.
        </p>
      </div>

      <!-- Project details -->
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; margin-bottom: 18px;">
        <p style="font-size: 12px; color: #888; margin: 0 0 5px;">
          PROJECT
        </p>
        <p style="font-size: 16px; font-weight: 700; margin: 0 0 14px;">
          ${projectName}
        </p>

        <p style="font-size: 12px; color: #888; margin: 0 0 5px;">
          ACCEPTED ROLE
        </p>
        <p style="font-size: 14px; font-weight: 600; margin: 0 0 14px;">
          ${role}
        </p>

        <p style="font-size: 12px; color: #888; margin: 0 0 5px;">
          ACCEPTED BY
        </p>
        <p style="font-size: 14px; font-weight: 600; margin: 0;">
          ${ownerName}
        </p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #555; margin: 0 0 18px;">
        You can now log in to your account and connect with your project team.
        Don't forget to coordinate with your teammates and get started!
      </p>

      <!-- Footer -->
      <p style="font-size: 13px; color: #555; margin: 0 0 5px;">
        Congratulations once again!
      </p>

      <p style="font-size: 13px; color: #555; margin: 0;">
        Team Student-Build
      </p>

      <div style="border-top: 1px solid #eee; margin-top: 22px; padding-top: 12px;">
        <p style="font-size: 11px; color: #999; margin: 0;">
          This is an automated notification. Please do not reply to this email.
        </p>
      </div>

    </div>
  `;
};


export default getApplicationAcceptedEmail;