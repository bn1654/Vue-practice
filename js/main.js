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
})

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
            <div class="cart">
                <button v-on:click="addToCart" :disabled="inventory <= 0" :class="{ disabledButton: inventory <= 0 }">Add to cart</button>
                <button v-on:click="deleteFromCart">Delete from cart</button>
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
            cart: 0
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
       cart: []
   },
   methods: {
   updateCart(id) {
       this.cart.push(id);
   },
   deleteFromCart(id){
    this.cart.pop(id);
   }
    }
});




