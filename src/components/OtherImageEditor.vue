<template>
  <div class="header">Drag and drop to change order</div>
  <button @click="handleSaveClick">Save</button>
  <Draggable
    v-model="props.nft.imageURLList"
    class="image-grid"
    :itemKey="(index: number) => index.toString()"
  >
    <template #item="{ element, index }">
      <div class="image-container">
        <div
          :class="{
            'align-right': index % 2 === 0,
            'align-left': index % 2 !== 0,
          }"
        >
          <img
            v-if="element"
            :src="compressImage(element)"
            :alt="`${nft.name} Image ${index}`"
            class="shadow-effect image-contain img-hover"
          />
        </div>
      </div>
    </template>
  </Draggable>
  <Dialog
    :show="dialogStatePendingTxn.visible"
    :modalMode="dialogStatePendingTxn.modalMode"
    @close="dialogStatePendingTxn.visible = false"
  >
    <h2 v-html="dialogStatePendingTxn.msg"></h2>

    <span v-if="dialogStatePendingTxn.showSpinner" class="spinner"></span>
    <br />
    <a
      :href="chainExplorerTx + dialogStatePendingTxn.pendingTxnHash"
      target="_blank"
      v-if="dialogStatePendingTxn.pendingTxnHash"
      >View on block explorer</a
    >
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from "vue";
import { PNFT } from "../types";
import { setOtherImageUrls } from "../nftContract";
import { compressImage } from "../util";
import Draggable from "vuedraggable";
import Dialog from "./Dialog.vue";
import { chainExplorerTx } from "../constant";
import { DialogState, handleTransaction } from "../dialog";

export default defineComponent({
  name: "OtherImageEditor",
  components: {
    Dialog,
    Draggable,
  },
  props: {
    nft: {
      type: Object as PropType<PNFT>,
      required: true,
    },
  },

  setup(props) {
    const handleSaveClick = async () => {
      await handleTransaction(dialogStatePendingTxn, () =>
        setOtherImageUrls(props.nft.tokenId, props.nft.imageURLList) //TODO if this gets expensive, can explore other ways to make cheaper
      );
    };

    const dialogStatePendingTxn = reactive<DialogState>({
      visible: false,
      msg: "",
      showSpinner: false,
      pendingTxnHash: "",
      modalMode: false,
    });

    return {
      props,
      handleSaveClick,
      compressImage,
      dialogStatePendingTxn,
      chainExplorerTx,
    };
  },
});
</script>

<style scoped>
.header {
  font-size: large;
}

.hoverhighlight {
  box-shadow: 0px 0px 5px 5px var(--logo-color);
}
</style>

<style scoped>
.image-container {
  /* No changes here, but you can add margin or padding if needed */
}

.image-container div.align-right {
  display: flex;
  justify-content: flex-end;
}

.image-container div.align-left {
  display: flex;
  justify-content: flex-start;
}

.image-container img {
  width: 80%;
  object-fit: contain;
  margin-left: auto;
  margin-right: auto;
}

.shadow-effect {
  max-width: 50%; /* maximum width of images  */
  height: auto; /* maintains aspect ratio */
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.9);
}

.img-hover:hover {
  box-shadow: 0px 0px 5px 5px var(--logo-color);  /* Adjust color and size to your liking */
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px; /* Adjust the gap as needed */
  max-height: 100vh; /* Max height to be the height of the viewport */
  overflow-y: auto; /* Show scrollbar if content overflows */
}

.image-contain {
  object-fit: contain; /* Preserve aspect ratio */

  width: 250px; /* adjust as needed */
  height: 250px; /* adjust as needed */
  object-fit: cover;
  border-radius: 5px; /* optional, if you want rounded corners */
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
  background: rgba(255, 255, 255, 0.4);
}

.content-wrapper {
  position: relative;
  z-index: 1;
}
</style>
