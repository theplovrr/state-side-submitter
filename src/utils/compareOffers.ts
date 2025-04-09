
interface JobOffer {
  state: string;
  salary: string;
}

interface OfferAnalysis {
  state: string;
  weeklySalary: number;
  annualSalary: number;
  homeStateTaxImpact: string;
  totalTaxes: string;
  irsStipendSafe: string;
  costOfLiving: string;
  estimatedTakeHome: number;
  isWinner?: boolean;
}

interface ComparisonResult {
  isSingleDestination: boolean;
  homeState: string;
  offers: OfferAnalysis[];
  additionalConsiderations: string[];
  reportDate: string;
}

export const compareOffers = (offer1: JobOffer, offer2: JobOffer, homeState: string): ComparisonResult => {
  const offers: OfferAnalysis[] = [];
  
  // Process offer 1 if it has data
  if (offer1.state && offer1.salary) {
    const weeklySalary1 = parseFloat(offer1.salary) || 0;
    const annualSalary1 = weeklySalary1 * 52;
    
    // Simulate tax estimates (would be calculated for real)
    const taxRate = Math.random() * 0.1 + 0.2; // Random 20-30% tax rate for demo
    const totalTaxes = Math.round(annualSalary1 * taxRate);
    const estimatedTakeHome = Math.round(annualSalary1 * (1 - taxRate));
    
    offers.push({
      state: offer1.state,
      weeklySalary: weeklySalary1,
      annualSalary: annualSalary1,
      homeStateTaxImpact: homeState === offer1.state ? "No impact" : "Tax implications may apply",
      totalTaxes: `$${totalTaxes.toLocaleString()}`,
      irsStipendSafe: homeState === offer1.state ? "No" : "Yes",
      costOfLiving: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      estimatedTakeHome: estimatedTakeHome
    });
  }
  
  // Process offer 2 if it has data
  if (offer2.state && offer2.salary) {
    const weeklySalary2 = parseFloat(offer2.salary) || 0;
    const annualSalary2 = weeklySalary2 * 52;
    
    // Simulate tax estimates (would be calculated for real)
    const taxRate = Math.random() * 0.1 + 0.2; // Random 20-30% tax rate for demo
    const totalTaxes = Math.round(annualSalary2 * taxRate);
    const estimatedTakeHome = Math.round(annualSalary2 * (1 - taxRate));
    
    offers.push({
      state: offer2.state,
      weeklySalary: weeklySalary2,
      annualSalary: annualSalary2,
      homeStateTaxImpact: homeState === offer2.state ? "No impact" : "Tax implications may apply",
      totalTaxes: `$${totalTaxes.toLocaleString()}`,
      irsStipendSafe: homeState === offer2.state ? "No" : "Yes",
      costOfLiving: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      estimatedTakeHome: estimatedTakeHome
    });
  }
  
  // Mark the winner (highest estimated take-home pay)
  if (offers.length > 1) {
    const winnerIndex = offers.reduce((maxIndex, offer, currentIndex, arr) => 
      offer.estimatedTakeHome > arr[maxIndex].estimatedTakeHome ? currentIndex : maxIndex, 0);
    offers[winnerIndex].isWinner = true;
  }
  
  const isSingleDestination = offers.length === 1;
  
  return {
    isSingleDestination,
    homeState,
    offers,
    additionalConsiderations: [
      "Research the cost of living in each location",
      "Consider state income tax rates (some states have no income tax)",
      "Factor in housing costs in each state",
      "Evaluate healthcare costs in each state",
      "Consider climate preferences and quality of life",
      "Research job market stability in each state",
      "Factor in potential relocation costs if applicable"
    ],
    reportDate: new Date().toLocaleDateString()
  };
};
