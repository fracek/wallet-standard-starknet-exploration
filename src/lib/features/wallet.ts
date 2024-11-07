import { RequestFn } from "get-starknet-core";

export const StarknetWallet = "starknet:wallet";

export type StarknetWalletVersion = "1.0.0";

export type StarknetWalletFeature = {
    readonly [StarknetWallet]: {
        readonly version: StarknetWalletVersion;
        readonly request: RequestFn;
    }
}
