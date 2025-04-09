
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
  userEmail: string;
  offers: OfferAnalysis[];
  additionalConsiderations: string[];
  reportDate: string;
}

export const compareOffers = (
  offers: JobOffer[], 
  homeState: string, 
  userEmail: string
): ComparisonResult => {
  const analysedOffers: OfferAnalysis[] = [];
  
  // Process each offer
  offers.forEach(offer => {
    if (offer.state && offer.salary) {
      const weeklySalary = parseFloat(offer.salary) || 0;
      const annualSalary = weeklySalary * 52;
      
      // Simulate tax estimates (would be calculated for real)
      const taxRate = Math.random() * 0.1 + 0.2; // Random 20-30% tax rate for demo
      const totalTaxes = Math.round(annualSalary * taxRate);
      const estimatedTakeHome = Math.round(annualSalary * (1 - taxRate));
      
      analysedOffers.push({
        state: offer.state,
        weeklySalary: weeklySalary,
        annualSalary: annualSalary,
        homeStateTaxImpact: homeState === offer.state ? "No impact" : "Tax implications may apply",
        totalTaxes: `$${totalTaxes.toLocaleString()}`,
        irsStipendSafe: homeState === offer.state ? "No" : "Yes",
        costOfLiving: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
        estimatedTakeHome: estimatedTakeHome
      });
    }
  });
  
  // Mark the winner (highest estimated take-home pay)
  if (analysedOffers.length > 1) {
    const winnerIndex = analysedOffers.reduce((maxIndex, offer, currentIndex, arr) => 
      offer.estimatedTakeHome > arr[maxIndex].estimatedTakeHome ? currentIndex : maxIndex, 0);
    analysedOffers[winnerIndex].isWinner = true;
  }
  
  const isSingleDestination = analysedOffers.length === 1;
  
  return {
    isSingleDestination,
    homeState,
    userEmail,
    offers: analysedOffers,
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
