<template>
  <transition name="dialog">
    <div class="modal-mask" v-if="show" @click="handleBackgroundClick" @keydown.esc="escapeKeyListener"> 
      <!-- TODO escapeKeyListener never seems to fire  -->
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop>
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    modalMode: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const handleBackgroundClick = () => {
      console.log("handleBackgroundClick, modalMode:", props.modalMode);
      if (props.modalMode) return;
      emit("close");
      emit("refresh");
    };

    const escapeKeyListener = () => {
      // if (evt.key === "Escape") {
        console.log("escapeKeyListener, modalMode:", props.modalMode);
        if (props.modalMode) return;
        emit("close");
        emit("refresh");
      // }
    };

    // onMounted(() => {
    //   // Add the keydown event listener when the component is mounted
    //   document.addEventListener("keydown", escapeKeyListener);
    // });

    // onBeforeUnmount(() => {
    //   // Remove the keydown event listener when the component is unmounted
    //   document.removeEventListener("keydown", escapeKeyListener);
    // });

    // Don't forget to return your function if you're going to use it in the template
    return {
      handleBackgroundClick,
      escapeKeyListener,
      props,
    };
  },
});
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-body{
  color: white;
}
.modal-wrapper {
  margin: 0 20px;
  border: 1px solid lightgrey;
  position: relative;
  min-width: 350px;
  max-height: 90vh;  /* add this, 90vh means 90% of the viewport height, adjust this value to what works best for you */
  overflow: auto;  /* add this, to allow scroll if content overflows */

}

.modal-container {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
}

.modal-header h2 {
  margin-top: 0;
}

.modal-footer {
  text-align: right;
}

.modal-default-button {
  float: right;
}
</style>
