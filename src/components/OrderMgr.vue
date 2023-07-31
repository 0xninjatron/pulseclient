<template>
  <div class="wrapper">
    <div class="tabs">
      <div v-if="isOwnedByUser || (!isOwnedByUser && isSaleAvailable)">
        <div class="tab">
          <input
            type="radio"
            name="css-tabs"
            id="tab-1"
            v-bind:checked="!(isOwnedByUser && isSaleAvailable)"
            class="tab-switch"
          />
          <label for="tab-1" class="tab-label">{{
            isOwnedByUser ? "Sell item" : isSaleAvailable ? "Buy Item" : ""
          }}</label>

          <div class="tab-content">
            <div v-if="isOwnedByUser && !isSaleAvailable">
              <div class="large-text">List your item for sale!</div>
              <h3>No one can buy without you listing first</h3>
              <form @submit.prevent="submitSellItem">
                <label for="salePrice">Sale Price (ETH):</label>
                <input
                  id="salePrice"
                  v-model.number="salePrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                />
                <button type="submit">Sell Item</button>
                <br /><br />
                <i>5% fee upon completion of sale</i>
              </form>
            </div>
            <div v-if="isOwnedByUser && isSaleAvailable">
              <form @submit.prevent="submitSellItem">
                <label for="salePrice">Sale Price (ETH):</label>
                <input
                  id="salePrice"
                  v-model.number="salePrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                />
                <br />
                <br />
                <button type="submit">Update Sale Price</button>
                <br />
                <br />
                <i>5% fee upon completion of sale</i>
              </form>
            </div>
            <div v-if="!isOwnedByUser && isSaleAvailable">
              <h3>
                Want to set the main profile picture?<br /><br />Own the NFT,
                and control it!
              </h3>
              <details>
                <summary style="font-size: 0.8em">
                  Lightning Autosale enabled! Sell for 5x your price
                </summary>
                <div style="font-size: 0.8em">
                  <p>
                    Automatically setup selling for 5x your buy price, or
                    customize
                  </p>
                  Autosale price:
                  <input
                    type="number"
                    v-model="autoSalePrice"
                    placeholder="Enter sale price here"
                    style="width: 60px"
                    :min="salePrice"
                  />
                  ETH
                </div>
              </details>
              <form @submit.prevent="submitBuyItem">
                <div>
                  <h2>Price: {{ Number(nft.saleAmount) * 1e-18 }} ETH</h2>
                </div>

                <button type="submit">Buy</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isOwnedByUser && !isSaleAvailable">
        <h2>Item not for sale</h2>
      </div>
      <div v-if="isOwnedByUser">
        <div class="tab">
          <input
            type="radio"
            name="css-tabs"
            id="tab-2"
            class="tab-switch"
            v-bind:checked="isOwnedByUser && isSaleAvailable"
          />
          <label for="tab-2" class="tab-label">Profile picture</label>
          <div class="tab-content">
            <FileUpload
              v-if="nft && nft.isOwner"
              :nft="nft"
              :selectedImageUrl="selectedImageUrl"
              slot="default"
              @close="$emit('close')"
            />
          </div>
        </div>
      </div>
    </div>

    <Dialog
      :show="dialogState.visible"
      :modalMode="dialogState.modalMode"
      @close="dialogState.visible = false"
    >
      <h2 v-html="dialogState.msg"></h2>

      <span v-if="dialogState.showSpinner" class="spinner"></span>
      <br />
      <a
        :href="chainExplorerTx + dialogState.pendingTxnHash"
        target="_blank"
        v-if="dialogState.pendingTxnHash"
        >View on block explorer</a
      >
    </Dialog>
  </div>
</template>

<script lang="ts">
import { ref, PropType, reactive } from "vue";
import { ethers } from "ethers";
import FileUpload from "./FileUpload.vue";
import Dialog from "./Dialog.vue";
import { PNFT } from "../types";
import { DialogState, handleTransaction } from "../dialog";
import { listNFT, buyNFT } from "../marketplace";
import { marketplaceAddress, autoSaleFactor } from "../constant";
import { checkIsApprovedForAll, setApprovalForAll } from "../nftContract";
import { chainExplorerTx } from "../constant";

export default {
  components: {
    FileUpload,
    Dialog,
  },
  props: {
    nft: {
      type: Object as PropType<PNFT>,
      required: true,
    },
    selectedImageUrl: {
      type: String as PropType<string | null>,
      required: false,
    },
  },
  setup(props) {
    const salePrice = ref(1.0);
    const autoSalePrice = ref(1.0);
    const isSaleAvailable =
      props.nft.saleAmount !== null && !props.nft.saleAmount.isZero();
    const isOwnedByUser = props.nft.isOwner;
    console.log("isSaleAvailable: ", isSaleAvailable);
    console.log("isOwnedByUser: ", isOwnedByUser);

    const dialogState = reactive<DialogState>({
      visible: false,
      msg: "",
      showSpinner: false,
      pendingTxnHash: "",
      modalMode: false,
    });

    if (props.nft.saleAmount && isSaleAvailable) {
      salePrice.value = Number.parseFloat(
        ethers.utils.formatUnits(props.nft.saleAmount, 18)
      );
      autoSalePrice.value = salePrice.value * autoSaleFactor;
    }

    /**
     * Will check isApprovedForAll first to determine if setApprovalForAll should be called
     * @returns
     */
    const checkAndSetupApprovalToMarketplace = async (): Promise<void> => {
      try {
        const isApproved = await checkIsApprovedForAll(marketplaceAddress);
        if (!isApproved) {
          console.log("Account not approved, setting approval...");
          await handleTransaction(dialogState, () =>
            setApprovalForAll(marketplaceAddress, true)
          );
        } else {
          console.log("Already approved");
        }
      } catch (error) {
        console.error(`Failed to checkAndSetupApprovalToMarketplace: ${error}`);
        throw error;
      }
    };

    const submitSellItem = async () => {
      await checkAndSetupApprovalToMarketplace();

      const salePriceBigNumber = ethers.utils.parseUnits(
        salePrice.value.toString(),
        18
      );
      handleTransaction(dialogState, () =>
        listNFT(props.nft.tokenId, salePriceBigNumber)
      );
    };

    const submitBuyItem = async () => {
      handleTransaction(dialogState, () =>
        buyNFT(
          props.nft.tokenId,
          ethers.BigNumber.from(props.nft.saleAmount),
          ethers.utils.parseEther(autoSalePrice.value.toString())
        )
      );
    };

    const isOpen = ref(false);

    return {
      salePrice,
      autoSalePrice,
      submitSellItem,
      submitBuyItem,
      isSaleAvailable,
      isOwnedByUser,
      isOpen,
      dialogState,
      chainExplorerTx,
    };
  },
};
</script>

<style scoped>
.sale-container {
  border: 1px solid lightgrey;
  border-radius: 10px;
  padding: 10px;
}

/**
From https://codepen.io/alvarotrigo/pen/QWqXYmG
**/

* {
  box-sizing: border-box;
}
body {
  font-family: "Open Sans";
  background: #2c3e50;
  color: #ecf0f1;
  line-height: 1.618em;
}
.wrapper {
  /* max-width: 150rem; */
  /* width: 100%; */
  margin: 0 auto;
}
.tabs {
  position: relative;
  /* margin: 3rem 0; */
  /* background: #1abc9c; */
  height: 550px;
}
.tabs::before,
.tabs::after {
  content: "";
  display: table;
}
.tabs::after {
  clear: both;
}
.tab {
  float: left;
}
.tab-switch {
  display: none;
}
.tab-label {
  position: relative;
  display: block;
  line-height: 2.75em;
  height: 3em;
  /* width: 240px; */
  /* display: inline-block; */
  padding: 0 1.618em;
  /* background: #1abc9c; */
  /* border-right: 0.125rem solid lightslategrey; */
  color: #fff;
  cursor: pointer;
  top: 0;
  transition: all 0.25s;
}
.tab-label:hover {
  top: -0.25rem;
  transition: top 0.25s;
}
.tab-content {
  height: 500px;
  /* min-width: 450px; */
  position: absolute;
  z-index: 1;
  top: 2.75em;
  left: 0;
  padding: 1.618rem;
  background: #fff;
  color: #2c3e50;
  border-bottom: 0.25rem solid #bdc3c7;
  opacity: 0;
  transition: all 0.35s;
}
.tab-switch:checked + .tab-label {
  background: #fff;
  color: #2c3e50;
  border-bottom: 0;
  border-right: 0.125rem solid #fff;
  transition: all 0.35s;
  z-index: 1;
  top: -0.0625rem;
}
.tab-switch:checked + label + .tab-content {
  z-index: 2;
  opacity: 1;
  transition: all 0.35s;
}

.large-text {
  font-size: xx-large;
  font-weight: 600;
  /* margin: 0; */
  /* padding: 0; */
}
</style>
