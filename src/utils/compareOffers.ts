
interface JobOffer {
  state: string;
  salary: string;
}

export const compareOffers = (offer1: JobOffer, offer2: JobOffer): string => {
  const weeklySalary1 = parseFloat(offer1.salary) || 0;
  const weeklySalary2 = parseFloat(offer2.salary) || 0;
  
  // Calculate annual salary (weekly * 52)
  const annualSalary1 = weeklySalary1 * 52;
  const annualSalary2 = weeklySalary2 * 52;

  const offerReport = `JOB OFFER COMPARISON REPORT
=============================

OFFER 1
------------------------------
Location: ${offer1.state}
Weekly Salary: $${weeklySalary1.toLocaleString()}
Annual Salary: $${annualSalary1.toLocaleString()}

OFFER 2
------------------------------
Location: ${offer2.state}
Weekly Salary: $${weeklySalary2.toLocaleString()}
Annual Salary: $${annualSalary2.toLocaleString()}

COMPARISON SUMMARY
------------------------------
Weekly Salary Difference: $${Math.abs(weeklySalary1 - weeklySalary2).toLocaleString()} ${
    weeklySalary1 > weeklySalary2
      ? `(Offer 1 pays more)`
      : weeklySalary2 > weeklySalary1
      ? `(Offer 2 pays more)`
      : "(Equal offers)"
  }

Annual Salary Difference: $${Math.abs(annualSalary1 - annualSalary2).toLocaleString()}

State Comparison: ${offer1.state} vs. ${offer2.state}
${
  offer1.state !== offer2.state
    ? `- Consider cost of living differences between ${offer1.state} and ${offer2.state}`
    : ""
}
${
  offer1.state !== offer2.state
    ? "- Research state tax implications for each location"
    : ""
}

ADDITIONAL CONSIDERATIONS
------------------------------
- Research the cost of living in each location
- Consider state income tax rates (some states have no income tax)
- Factor in housing costs in each state
- Evaluate healthcare costs in each state
- Consider climate preferences and quality of life
- Research job market stability in each state
- Factor in potential relocation costs if applicable

Report generated on: ${new Date().toLocaleDateString()}
`;

  return offerReport;
};
