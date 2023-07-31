<template>
  <div>
    <div>
      <div v-if="selectedImageUrl == null">
        <div
          @dragover.prevent
          @drop="dropFile"
          style="
            height: 200px;
            width: 100%;
            border: 5px dashed lightgrey;

            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <img
            v-if="uploadedFileContents"
            :src="uploadedFileContents"
            class="thumbnail"
          />
          <span v-else><h2>Drop file here</h2></span>
        </div>
        <div style="margin-top: 20px">
          <input
            type="file"
            id="fileInput"
            @change="uploadFile"
            ref="fileInput"
            style="display: none"
          />
<!-- 
          <label
            for="fileInput"
            style="cursor: pointer; border: 1px dashed grey"
          >
            Browse...
          </label> -->

          <button @click="handleOtherImageEditorClick">Other Images Manager...</button>
        
        </div>
      </div>
      <h2 v-if="selectedImageUrl">Use selected image:</h2>
      <img
        v-if="selectedImageUrl"
        :src="replaceIpfsPrefix(selectedImageUrl)"
        alt="Selected Image"
        class="thumbnail"
        :class="{ hoverhighlight: isHighlighted }"
        @mouseover="isHighlighted = true"
        @mouseout="isHighlighted = false"
        @click="handleThumbnailImageClick"
      />
    </div>

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

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, PropType, computed, reactive } from "vue";
import { PNFT } from "../types";
import Dialog from "./Dialog.vue";
import { setImageUrlHist } from "../nftContract";
import { WORKER_SERVICE_URL, chainExplorerTx } from "../constant";
import {  replaceIpfsPrefix } from "../util";
import { DialogState, handleTransaction } from "../dialog";


export default defineComponent({
  name: "IpfsUpload",
  components: {
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

  setup(props, { emit }) {
    const uploadedFile: Ref<File | null> = ref(null);
    const uploadedFileContents: Ref<string | null> = ref(null);
    const isHighlighted = ref(false);
    const dialogStatePendingTxn = reactive<DialogState>({
      visible: false,
      msg: "",
      showSpinner: false,
      pendingTxnHash: "",
      modalMode: false,
    });

   
    // The updated 'name' variable
    const name = ref("");

    // Compute placeholder text
    const placeholderText = computed(() => props.nft.name);

    const uploadFile = (event: Event) => {
      if ((event.target as HTMLInputElement).files?.length) {
        uploadedFile.value = (event.target as HTMLInputElement).files![0];
        if (uploadedFile.value.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            uploadedFileContents.value = (e.target?.result as string) || null;
          };
          reader.readAsDataURL(uploadedFile.value);
          submit();
        }
      }
    };

    const dropFile = (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer?.files.length) {
        uploadedFile.value = event.dataTransfer.files[0];
        if (uploadedFile.value.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            uploadedFileContents.value = (e.target?.result as string) || null;
          };
          reader.readAsDataURL(uploadedFile.value);
          submit();
        }
      }
    };

    const submit = async () => {
      if (!uploadedFile.value) return;
      const formData = new FormData();

      formData.append("file", uploadedFile.value);
      const result = await fetch(WORKER_SERVICE_URL + "upload", {
        method: "POST",
        body: formData,
      });

      console.log("worker result: ", result);
      if (result.status == 200) {
        const json = await result.json();
        console.log("worker result json: ", json);
        const ipfsHash = json.IpfsHash;
        const url = "ipfs://" + ipfsHash;

        setImageModal(props.nft.tokenId, url);
      }
      
    };

    // New method for handling image click
    const handleThumbnailImageClick = async () => {
      if (props.selectedImageUrl) {
        setImageModal(props.nft.tokenId, props.selectedImageUrl);
      }
    };

    const setImageModal = async (tokenId: number, imageUrl: string) => {
      await handleTransaction(dialogStatePendingTxn, () => setImageUrlHist(tokenId, imageUrl));
    };

    
    const handleOtherImageEditorClick = async () => {
      emit("close");
    }

    return {
      name,
      uploadFile,
      dropFile,
      submit,
      placeholderText,
      uploadedFileContents,
      replaceIpfsPrefix,
      isHighlighted,
      handleThumbnailImageClick,
      setImageModal,
      dialogStatePendingTxn,
      handleOtherImageEditorClick,
      chainExplorerTx,

    };
  },
});
</script>

<style scoped>
.thumbnail {
  width: 250px; /* adjust as needed */
  height: 250px; /* adjust as needed */
  object-fit: cover; /* this will ensure that your image covers the whole area of the thumbnail, cropping if necessary */
  border-radius: 5px; /* optional, if you want rounded corners */
}

.hoverhighlight {
  box-shadow: 0px 0px 15px 5px var(--glow-green-color); 
}
</style>