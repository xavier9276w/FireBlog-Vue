<template>
    <div class="reset-password">
        <loading v-if="loadingActive"/>
        <modal v-if="modalActive" v-bind:modalMessage="modalMessage" v-on:close-modal="closeModal"/>
        <div class="form-wrap">
            <form class="reset">
                <p class="login-register">
                Already have an account? Back to
                <router-link class="router-link" :to="{name: 'Login' }">Login</router-link>
                </p>
                <h2>Reset Password</h2>
                <p>Forgot your password? Enter your email to reset it</p>
                <div class="inputs">
                    <div class="input">
                        <input type="text" placeholder="Email" v-model="email"/>
                        <email class="icon"/>
                    </div>
                </div>
                <button v-on:click.prevent="resetPassword">Reset</button>
                <div class="angle">
                </div>
            </form>
            <div class="background"></div>
        </div>
    </div>
</template>

<script>
import email from "../assets/Icons/envelope-regular.svg"
import modal from "../components/Modal.vue"
import loading from "../components/Loading.vue"
import firebase from "firebase/app"
import "firebase/auth";

export default{
    name: "ForgotPassword",
    components: {
      email, modal, loading,
    },
    data() {
        return {
            email: "",
            modalActive: false,
            modalMessage: "",
            loadingActive: null,
        };
    },
    methods: {
        resetPassword() {
            this.loadingActive = true;
            firebase.auth().sendPasswordResetEmail(this.email)
            .then(() => {
                this.modalMessage = "If your account exist, you will receive a password reset email!";
                this.loadingActive = false;
                this.modalActive = true;
            })
            .catch((error) => {
                this.loadingActive = false;
                this.modalMessage = error.message;
                this.modalActive = true;
            });
        },
        closeModal() {
            this.modalActive = !this.modalActive;
            this.email = "";
        }
    }
}
</script>

<style lang="scss" scoped>
.reset-password {
    position: relative;
    .form-wrap {
        .reset {
            h2 {
                margin-bottom: 8px;
            }

            p {
                text-align: center;
                margin-bottom: 32px;
            }
        }
    }
}
</style>