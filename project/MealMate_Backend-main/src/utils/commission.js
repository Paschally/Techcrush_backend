const COMMISSION_RATE = 0.10;

const calculateCommission = (amount) => {
  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const commission = Number(
    (amount * COMMISSION_RATE).toFixed(2)
  );

  const cookAmount = Number(
    (amount - commission).toFixed(2)
  );

  return {
    commission,
    cookAmount,
  };
};

export default calculateCommission;