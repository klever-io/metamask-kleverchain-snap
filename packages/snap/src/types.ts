export type SignMessageParams = {
  message: string;
  origin: string;
};

export type ValidateSignatureParams = {
  message: string;
  signature: string;
  address: string;
};
