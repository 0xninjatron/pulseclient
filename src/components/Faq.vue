<template>
  <div class="faq-container">
    <h1>Frequently Asked Questions (FAQ):</h1>
    <div class="faq-item">
      <h2>What can I do when I buy this NFT?</h2>
      <p>
        You have full control over a person's profile picture.
        For example, if you purchase the NFT representing a President, you can upload your own image. It can be positive or negative or 
        anything in between, it's your choice!
      </p>
    </div>
    <div class="faq-item">
      <h2>How do mints work? Why aren't there 10,000 NFTs already minted?</h2>
      <p>
        We are doing things a little differently, and have only minted a few so far.  We want to take time and ensure everything is running smoothly, and will slowly ramp up minting.
        <p></p>
        The minting process 
        begins with the selection of a name for the next available mint. Once the name is added to the 
        smart contract, anyone can mint like any other standard ERC 721 token (see <a :href="chainExplorerAddress + nftContractAddress" target="_blank">contract</a>). Currently, the minting fee 
        is set at 0 but is subject to change in the future.
      </p>
    </div>    
    <div class="faq-item">
      <h2>What metadata can users change?</h2>
      <p>
        Our intuitive app empowers NFT owners to have control over their profile pictures in a seamless manner. Behind the scenes, we upload to IPFS and change the onchain metadata key "image". Any other metadata key and values can be added onchain. We are continually looking to enhance user experience based on feedback, and additional features may be added in the future.
      </p>
    </div>
    <div class="faq-item">
      <h2>Who runs this project?</h2>
      <p>
        Pulse Project was initiated by 0xninjatron as an experimental venture. This is a community-driven project, and our team is passionate about exploring the potential of NFTs and the decentralized ecosystem.
      </p>
    </div>
    <div class="faq-item">
      <h2>Is there a token?</h2>
      <p>
        Currently, there is no native token associated with Pulse Project. However, we remain open to incorporating new ideas and exploring community interests. We might consider transitioning to a governance model based on valueless governance tokens, ensuring an inclusive and participatory approach for the community.
      </p>
    </div>
    <div class="faq-item">
      <h2>What NFT exchange do you use?</h2>
      <p>
        We believe in providing a unique and tailored experience for our community, so we developed our own custom small-scale ERC2981 compliant solution that exclusively focuses on our use case.  For details see <a :href="chainExplorerAddress + marketplaceAddress" target="_blank">contract</a>
      </p>
    </div>
    <div class="faq-item">
      <h2>Are the contracts audited?</h2>
      <p>
        No, however, we plan to conduct one in the future.
      </p>
    </div>
    <div class="faq-item">
      <h2>Are there any fees?</h2>
      <p>
        To fund ongoing development and contract auditing, we charge a 5% commission fee per sale. This fee enables us to maintain the platform's integrity, implement improvements, and ensure the highest level of security and innovation for our users. We are committed to utilizing these resources to continually enhance the Pulse Project experience for our growing community.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { chainExplorerAddress, nftContractAddress, marketplaceAddress } from "../constant"

export default defineComponent({
  name: 'FAQ',
  data() {
    return {
      chainExplorerAddress,
      marketplaceAddress,
      nftContractAddress, 
    }
  }
});
</script>

<style scoped>
.faq-container {
  padding: 1em;
  max-width: 75%;
  margin: 0 auto;
  text-align: left;
}

.faq-item {
  margin-bottom: 2em;
}

.faq-item h2 {
  margin-bottom: 0.5em;
}
</style>
