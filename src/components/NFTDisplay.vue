<template>
  <div>
    <div
      class="background-wrapper"
      :style="{ backgroundImage: `url(${randomImage})` }"
    >
      <div class="content-wrapper">
        <div v-for="(nft, index) in PNFTs" :key="index">
          <h1>{{ nft?.name }}</h1>

          <img
            v-if="nft.imageURL"
            :src="replaceIpfsPrefix(nft.imageURL)"
            :alt="nft.name"
            :class="{
              'shadow-effect': true,
              'image-contain': true,
              'img-hover': true,
            }"
            @mouseover="
              nft.isOwner ? (showTooltip = true) : (showTooltip = false)
            "
            @click="handleImageClick(nft, null)"
            :title="
              nft.saleAmount != null && !nft.saleAmount.isZero()
                ? `For Sale: ${parseFloat(
                    ethers.utils.formatEther(nft.saleAmount)
                  ).toFixed(2)} ETH`
                : ''
            "
          />
          <h2>Other images</h2>
          <div class="image-grid">
            <div
              v-for="(imageUrl, index) in nft.imageURLList"
              :key="index"
              class="image-container"
              :class="{
                'align-right': index % 2 === 0,
                'align-left': index % 2 !== 0,
              }"
            >
              <img
                v-if="imageUrl"
                :src="replaceIpfsPrefix(imageUrl)"
                :alt="`${nft.name} Image ${index}`"
                class="shadow-effect image-contain img-hover"
                @click="handleImageClick(nft, imageUrl)"
              />
            </div>
          </div>
        </div>

        <Dialog
          :show="modalDlg"
          :title="nft?.tokenId ? nft.tokenId.toString() : undefined"
          @close="modalDlg = false"
          @refresh="refresh"
        >
          <OrderMgr
            v-if="nft"
            :nft="nft"
            :selectedImageUrl="selectedImageUrl"
            @close="handleClose"
            @refresh="refresh"
          />
          <template v-else> </template>
        </Dialog>

        <Dialog :show="modalOtherImageEditor" @close="modalOtherImageEditor = false">
          <OtherImageEditor v-if="nft" :nft="nft" />
          <template v-else> </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from "vue";
import Dialog from "./Dialog.vue";
import OrderMgr from "./OrderMgr.vue";
import { ethers } from "ethers";
import { getNFTListPrice } from "../marketplace";
import { web3 } from "../web3init";
import { replaceIpfsPrefix } from "../util";
import { fetchTokenURI, ownerOf, nftContractAddress } from "../nftContract";
import OtherImageEditor from "./OtherImageEditor.vue";

import { PNFT } from "../types";

export default {
  components: {
    Dialog,
    OrderMgr,
    OtherImageEditor,
  },
  setup() {
    const modalDlg = ref(false);
    const modalOtherImageEditor = ref(false);
    const nft = ref<PNFT | null>(null);
    const showTooltip = ref(false);
    const selectedImageUrl = ref<string | null>(null);

    const handleClose = () => {
      modalDlg.value = false;
      modalOtherImageEditor.value = true;
    };

    const handleImageClick = (_nft: PNFT, _selectedImageUrl: string | null) => {
      nft.value = _nft;
      selectedImageUrl.value = _selectedImageUrl;
      modalDlg.value = true;
    };

    const fetchNFT = async (tokenIds: number[]) => {
      console.log("fetchNFT");
      const PNFTs: PNFT[] = [];

      for (const tokenId of tokenIds) {
        const tokenMetadata = await fetchTokenURI(tokenId);
        console.log("tokenMetadata: ", tokenMetadata);

        const owner = await ownerOf(tokenId);
        const accounts = await web3.eth.getAccounts();

        console.log("owner: ", owner);
        console.log("accounts[0]: ", accounts[0]);
        const isOwner =
          owner?.toLowerCase() === accounts?.[0]?.toLowerCase() || false;
        const listPrice = await getNFTListPrice(tokenId);

        PNFTs.push({
          contractAddress: nftContractAddress,
          name: tokenMetadata.name,
          tokenId: tokenId,
          imageURL: tokenMetadata.imageUrl,
          imageURLList: tokenMetadata.otherImageUrls,
          isOwner: isOwner ? isOwner : false,
          saleAmount: listPrice
            ? ethers.BigNumber.from(listPrice.toString())
            : null,
          sellerAddress: owner ? owner : null,
        });
      }
      console.log(PNFTs);
      // return { PNFTs };
      return PNFTs;
    };

    const PNFTs = ref<PNFT[]>([]);

    onMounted(async () => {
      PNFTs.value = await fetchNFT([0]);
    });

    const refresh = async () => {
      // Extract the tokenId's from PNFTs.
      const tokenIds = PNFTs.value.map((nft) => nft.tokenId);
      // Use those ids to fetch the NFTs again
      const newNFTs = await fetchNFT(tokenIds);
      // Replace the current PNFTs with the newly fetched ones
      PNFTs.value = newNFTs;
    };

    // Image array
    const images = ref([
      "https://ipfs.io/ipfs/QmaoMomXnUL7bsThLwoCZ4UkJETqmMJEUfGvSgaHz1pHTZ", //chaos crowd
      "https://ipfs.io/ipfs/QmdKx4h3jPjyKrYFbm5oLdKbYETtEUoDuC98ddDrTDERby", //fire crowd
      // add more image paths as needed...
    ]);

    // Randomly select an image from the array
    const randomImage = computed(() => {
      const index = Math.floor(Math.random() * images.value.length);
      return images.value[index];
    });

    return {
      PNFTs,
      modalDlg,
      modalOtherImageEditor,
      nft,
      handleImageClick,
      showTooltip,
      ethers,
      selectedImageUrl,
      replaceIpfsPrefix,
      refresh,
      randomImage,
      handleClose,
    };
  },
};
</script>

<style scoped>

.image-container {
  display: flex;
  /* width: 100%; */
}

.image-container img {
  width: 50%;
}

.shadow-effect {
  max-width: 50%; /* maximum width of images  */
  height: auto; /* maintains aspect ratio */
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.9);
}

.img-hover:hover {
  cursor: pointer;
  box-shadow: 0px 0px 15px 5px var(--glow-green-color); 
}
.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

.align-right {
  justify-content: flex-end;
}

.align-left {
  justify-content: flex-start;
}

.image-contain {
  object-fit: contain; /* Preserve aspect ratio */
  /* max-width: 100%; Ensure the image doesn't exceed its container's width */
  max-height: 100%; /* Ensure the image doesn't exceed its container's height */
}

.background-wrapper {
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  padding: 1em;
}

.background-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* background: rgba(0, 0, 0, 0.5); */
  background: rgba(255, 255, 255, 0.4);
}

.content-wrapper {
  position: relative;
  z-index: 1;
  /* width: 100%; */
}
</style>
