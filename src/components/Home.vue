<template>
  <div class="container">
    <div class="grey-background">
      <h1 class="title">Pulse Project: Your NFT, Your Style</h1>
      <p>
        Take control of your NFTs like never before with Pulse Project, the
        ultimate platform that lets you choose and control your metadata and
        profile pictures.
      </p>
      <div class="image-container">
        <img
          :src="randomImageUrl"
          alt="Pulse Project"
        />
      </div>
    </div>
    <div>
      <div className="content-row">
        <div className="text-content">
          <h2 class="section-title">Our Mission</h2>
          <p>
            We began as an experiment to empower users with control over their
            NFT's metadata. Through smart contract technology, only the current
            owner has the authority to modify a profile picture, creating a
            user-driven mapping of images to names.
          </p>
        </div>
        <div className="image-content">
          <img className="image-inset-content"
            src="https://ipfs.io/ipfs/QmSjaN1pyPZ8foMexyTCAXRC4YUTHb2D7yYMWXXnM2kwmF/woman-varying-art.webp"
          />
        </div>
      </div>

      <div className="content-row grey-background">
        <div className="text-content">
          <h2 class="section-title">Arbitrum Layer 2</h2>
          <p>
            To ensure an accessible and cost-effective platform, we've chosen
            Arbitrum's Layer 2 solution. This means reduced transaction costs
            and a smoother experience for all participants.
          </p>
        </div>
        <div className="image-content">
          <img className="image-inset-content"
            src="https://ipfs.io/ipfs/QmSjaN1pyPZ8foMexyTCAXRC4YUTHb2D7yYMWXXnM2kwmF/future-tree.webp"
          />
        </div>
      </div>

      <div className="content-row">
        <div className="text-content">
          <h2 class="section-title">IPFS</h2>
          <p>
            To optimize storage costs, we store NFT images on IPFS, while the
            on-chain metadata points to their locations. Our seamless
            integration takes care of the technicalities behind the scenes, so
            you can focus on enjoying the Pulse Project experience without
            hassle.
          </p>
        </div>
        <div className="image-content">
          <img className="image-inset-content"
            src="https://ipfs.io/ipfs/QmSjaN1pyPZ8foMexyTCAXRC4YUTHb2D7yYMWXXnM2kwmF/people-stairs.webp"
          />
        </div>
      </div>

      <div className="content-row grey-background">
        <div className="text-content">
          <h2 class="section-title">Discover</h2>
          <p>
            Discover the real-world application of user controlled metadata, and
            join us in shaping the future of NFTs. Pulse Project invites you to
            explore a unique way of selecting profile pictures. Embrace the
            possibilities today!
          </p>
        </div>
        <div className="image-content">
          <img className="image-inset-content"       
            src="https://ipfs.io/ipfs/QmSjaN1pyPZ8foMexyTCAXRC4YUTHb2D7yYMWXXnM2kwmF/astronaut.webp"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  data() {
    return {
      imageUrls: [
        'https://ipfs.io/ipfs/QmSjaN1pyPZ8foMexyTCAXRC4YUTHb2D7yYMWXXnM2kwmF/art-gallery-person-stairs.webp',
        'https://ipfs.io/ipfs/QmSjaN1pyPZ8foMexyTCAXRC4YUTHb2D7yYMWXXnM2kwmF/art-splash.webp',
        'https://ipfs.io/ipfs/QmSjaN1pyPZ8foMexyTCAXRC4YUTHb2D7yYMWXXnM2kwmF/ball%20and%20balloon.webp',
        'https://ipfs.io/ipfs/QmSjaN1pyPZ8foMexyTCAXRC4YUTHb2D7yYMWXXnM2kwmF/small%20man%20large%20gallery.webp',
        'https://ipfs.io/ipfs/QmSjaN1pyPZ8foMexyTCAXRC4YUTHb2D7yYMWXXnM2kwmF/woman-varying-art.webp',              
      ]
    }
  },
  computed: {
    randomImageUrl() {
      return this.imageUrls[Math.floor(Math.random() * this.imageUrls.length)];
    }
  }
});
</script>

<style scoped>
.container {
  text-align: center;
}

.title {
  font-weight: 800;
  padding-top: .5em; 
  margin-top: 0; /* add this line to reduce the top margin from H1 */ 
}

.image-container img {
  width: 92%;
  max-width: 100%; /* This will ensure the image does not exceed its container's width */
}
.text-content p {
  padding: 1em; /* some padding around text */
  text-align: left;
}

.home {
  width: 80vw;
  margin: 0 auto;
}

.content-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 2em;
  margin-bottom: 2em; /* some margin between rows, adjust as needed */
}

.content-row:nth-child(even) {
  flex-direction: row-reverse;
}

.text-content,
.image-content {
  width: 50%; /* they take half of the space */
}

.image-inset-content{
  width: 80%;
}
.text-content p {
  padding: 1em; /* some padding around text */
}

.grey-background {
  /*  #F4F8FE; */
  background-color: #f3f4f7;
}

.section-title {
  font-size: 2.0em; /* This is typically the default font-size for h2 elements */
}

</style>
