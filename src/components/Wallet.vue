<template>
  <div class="wallet-container">
    <button @click="connectWallet">
      <div v-if="!isWalletConnected">Connet Wallet</div>
      <div v-else>
        <p>{{ userAddress }}</p>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { web3 } from "../web3init";
import { shortenAddress } from "../util";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default defineComponent({
  name: "Wallet",
  data() {
    return {
      isWalletConnected: false,
      userAddress: "",
    };
  },
  methods: {
    async connectWallet() {
      try {
        if (window.ethereum) {
          if (this.isWalletConnected) {
            return;
          }
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const accounts = await web3.eth.getAccounts();

          this.isWalletConnected = true;
          this.userAddress = shortenAddress(accounts[0]);
        } else {
          throw new Error(
            "No Ethereum provider found. Please install MetaMask."
          );
        }
                
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    },
  },
  mounted() {
    this.connectWallet();
  },
});
</script>

<style scoped>
.wallet-container {
  border-radius: 0.625em;
  padding: 0px 1.25em; /* Reduce padding to make box smaller */
}

</style>
