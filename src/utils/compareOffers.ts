
interface JobOffer {
  company: string;
  position: string;
  state: string;
  salary: string;
  benefits: string;
  remote: string;
}

const formatRemoteOption = (option: string): string => {
  switch (option) {
    case "fully_remote":
      return "Fully Remote";
    case "hybrid":
      return "Hybrid";
    case "in_office":
      return "In Office";
    default:
      return "Not specified";
  }
};

export const compareOffers = (offer1: JobOffer, offer2: JobOffer): string => {
  const salary1 = parseFloat(offer1.salary) || 0;
  const salary2 = parseFloat(offer2.salary) || 0;

  const offerReport = `JOB OFFER COMPARISON REPORT
=============================

OFFER 1: ${offer1.position} at ${offer1.company}
------------------------------
Location: ${offer1.state}
Annual Salary: $${salary1.toLocaleString()}
Benefits: ${offer1.benefits || "Not specified"}
Work Format: ${formatRemoteOption(offer1.remote)}

OFFER 2: ${offer2.position} at ${offer2.company}
------------------------------
Location: ${offer2.state}
Annual Salary: $${salary2.toLocaleString()}
Benefits: ${offer2.benefits || "Not specified"}
Work Format: ${formatRemoteOption(offer2.remote)}

COMPARISON SUMMARY
------------------------------
Salary Difference: $${Math.abs(salary1 - salary2).toLocaleString()} ${
    salary1 > salary2
      ? `(${offer1.company} offers more)`
      : salary2 > salary1
      ? `(${offer2.company} offers more)`
      : "(Equal offers)"
  }

State Difference: ${offer1.state === offer2.state ? "Same state" : "Different states"}
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

Remote Work Comparison: 
- ${offer1.company}: ${formatRemoteOption(offer1.remote)}
- ${offer2.company}: ${formatRemoteOption(offer2.remote)}

ADDITIONAL CONSIDERATIONS
------------------------------
- Research the cost of living in each location
- Consider career growth opportunities at each company
- Evaluate work-life balance and company culture
- Factor in commute time if applicable
- Assess job security and company stability
- Consider potential relocation costs if applicable
- Evaluate additional perks not reflected in base salary

Report generated on: ${new Date().toLocaleDateString()}
`;

  return offerReport;
};
