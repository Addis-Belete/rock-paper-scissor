export const validateFrom = (
  formData: {
    move: string;
    player2: string;
    salt: string;
    stakeAmount: string;
  },
  account: string | null
) => {
  const newErrors: {
    player2?: string;
    salt?: string;
    stakeAmount?: string;
  } = {};

  // Address validation
  if (!formData.player2) {
    newErrors.player2 = "Address is required";
  } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.player2)) {
    newErrors.player2 = "Invalid Ethereum address";
  } else if (formData.player2.toLowerCase() === account?.toLowerCase()) {
    newErrors.player2 = "Player two address should be different";
  }

  // Start block validation
  if (!formData.salt) {
    newErrors.salt = "Salt is required";
  } else if (isNaN(Number(formData.salt))) {
    newErrors.salt = "Salt must be a number";
  }

  if (!formData.stakeAmount) {
    newErrors.stakeAmount = "Stake Amount is required";
  } else if (isNaN(Number(formData.stakeAmount))) {
    newErrors.stakeAmount = "Stake Amount is must be a number";
  } else if (Number(formData.stakeAmount) <= 0) {
    newErrors.stakeAmount = "Stake Amount should be greater than 0";
  }

  return newErrors;
};