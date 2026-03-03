Vue.component('product-details', {
    template: `
        <ul>
                <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,
    data(){
        return {
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        }
    }
});

Vue.component('product-review', {
   template: `
   <form class="review-form" @submit.prevent="onSubmit">
   <p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>

 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>

 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>

 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>
 <p>
    <label for="recommend">Would you recommend this product?</label>
    <label for="recommend" style="display: flex; width: 50%; align-items: center;"><input type="radio" name="recommend" value="y" v-model="recommend" style="width: 50%; margin: 0px;">Yes</label>
    <label for="recommend" style="display: flex; width: 50%; align-items: center;"><input type="radio" name="recommend" value="n" v-model="recommend" style="width: 50%; margin: 0px;">No</label>
 </p>

 <p>
   <input type="submit" value="Submit"> 
 </p>

</form>
 `,
   data() {
       return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []

       }
   },
   methods:{
        onSubmit() {
        if(this.name && this.review && this.rating && this.recommend){
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                recommend: this.recommend
            };
            this.$emit('review-submitted', productReview);
            this.name = null;
            this.review = null;
            this.rating = null;
            this.recommend = null;
        }else{
            if(!this.name) this.errors.push("Name required.")
            if(!this.review) this.errors.push("Review required.")
            if(!this.rating) this.errors.push("Rating required.")
            if(!this.recommend) this.errors.push("Recommend required.")
        }
        }
        }


});

Vue.component('product', {
    props: {
       premium: {
           type: Boolean,
           required: true
       }
   },
   template: `
   <div class="product">
    <div class="product-image">
           <img :src="image" :alt="altText"/>
       </div>
       <div class="product-info">
           <h1>{{ title }}</h1>
           <span>{{ sale }}</span>
            <p>{{ description }}</p>
            <product-details></product-details>
            <p>Shipping: {{ shipping }}</p>
            <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)"
            ></div>

            <span v-for="size in sizes">
                {{ size + " "}}
            </span>
            <p v-if="inventory > 10">In stock</p>
            <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
            <p v-else :class="{ outOfStock: inventory <= 0 }">Out of stock</p>
            <a :href="link">More products like this</a> 
            <button v-on:click="addToCart" :disabled="inventory <= 0" :class="{ disabledButton: inventory <= 0 }">Add to cart</button>
            <button v-on:click="deleteFromCart">Delete from cart</button>
        <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                        <p> Recommend: <span v-if="review.recommend=='y'">Yes</span><span v-else>No</span></p>
                    </li>
                </ul>
                <product-review @review-submitted="addReview"></product-review>
            </div>

       </div>
   </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: true,
            variants: [
                            {
                                variantId: 2234,
                                variantColor: 'green',
                                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                                variantQuantity: 10,
                            },
                            {
                                variantId: 2235,
                                variantColor: 'blue',
                                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                                variantQuantity: 4,
                            }
                        ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            this.variants[this.selectedVariant].variantQuantity -= 1;
        },
        deleteFromCart(){
                this.$emit('delete-from-cart', this.variants[this.selectedVariant].variantId);
                this.variants[this.selectedVariant].variantQuantity += 1;
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inventory(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            if(this.onSale) return this.brand + ' ' + this.product + ' is on sale now!'
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }

    }
}
);

let app = new Vue({
   el: '#app',
   data: {
       premium: true,
       cart: [],

   },
   methods: {
   updateCart(id) {
       this.cart.push(id);
   },
   deleteFromCart(id){
    this.cart.pop(id);
   },
   

    }
});




