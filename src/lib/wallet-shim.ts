import { StandardConnectFeature, StandardEventsFeature, WalletIcon, WalletVersion, WalletAccount, IdentifierArray, WalletWithFeatures, ReadonlyUint8Array, StandardConnectInput, StandardConnectOutput, StandardEventsNames, StandardEventsListeners, StandardConnect, StandardEvents } from "@wallet-standard/core";
import { StarknetWindowObject } from "get-starknet-core";

import { StarknetWallet, type StarknetWalletFeature } from "./features/wallet";

export class WalletShim implements WalletWithFeatures<StarknetWalletFeature & StandardConnectFeature & StandardEventsFeature> {
    private _accounts: WalletAccount[] = [];

    constructor(private readonly injected: StarknetWindowObject) {
        this.injected.on("accountsChanged", (accounts?: string[]) => { this.updateAccounts(accounts) });
    }

    get version(): WalletVersion {
        return "1.0.0";
    }

    get name(): string {
        return this.injected.name;
    }

    get icon(): WalletIcon {
        if (typeof this.injected.icon === "string") {
            return this.injected.icon as WalletIcon;
        }
        return this.injected.icon.light as WalletIcon;
    }

    get chains(): IdentifierArray {
        return [];
    }

    get accounts(): WalletAccount[] {
        return this._accounts;
    }

    get features() {
        return {
            "standard:connect": {
                version: "1.0.0" as const,
                connect: this.connect.bind(this),
            },
            "standard:events": {
                version: "1.0.0" as const,
                on: this.on.bind(this),
            },
            "starknet:wallet": {
                version: "1.0.0" as const,
                request: this.injected.request.bind(this.injected),
            }
        }
    }

    private async connect(args?: StandardConnectInput): Promise<StandardConnectOutput> {
        // TODO: implement
        const { silent } = args ?? {};

        return {
            accounts: [],
        }
    }

    private on<E extends StandardEventsNames>(event: E, listener: StandardEventsListeners[E]): () => void {
        // TODO: implement
        return () => { };
    }

    private updateAccounts(accounts?: string[]) {
        if (!accounts) {
            this._accounts = [];
            return;
        }

        this._accounts = accounts.map((address) => new WalletAccountShim(address));
    }
}

export class WalletAccountShim implements WalletAccount {
    constructor(private readonly _address: string) { }

    get address(): string {
        return this._address;
    }

    get publicKey(): ReadonlyUint8Array {
        return new Uint8Array();
    }

    get chains(): IdentifierArray {
        // TODO: should have just the current chain id.
        return [];
    }

    get features(): IdentifierArray {
        return [StandardConnect, StandardEvents, StarknetWallet];
    }
}