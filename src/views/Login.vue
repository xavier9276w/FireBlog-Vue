<template>
  <div class="form-wrap">
    <form class="login">
      <p class="login-register">
        Don't have an account?
        <router-link class="router-link" :to="{ name: 'Register' }"
          >Register</router-link
        >
      </p>
      <h2>Login to Shareveler</h2>
      <div class="inputs">
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
          <email class="icon" />
        </div>
        <div class="input">
          <input type="password" placeholder="Password" v-model="password" />
          <password class="icon" />
        </div>
      </div>
      <div class="sign-in-options">
        <button
          class="authenticator"
          v-on:click.prevent="signInWithProvider('google')"
        >
          <google class="icon" />Sign in with Google
        </button>
        <button
          class="authenticator"
          v-on:click.prevent="signInWithProvider('facebook')"
        >
          <facebook class="icon" />Sign in with Facebook
        </button>
        <button
          class="authenticator"
          v-on:click.prevent="signInWithProvider('twitter')"
        >
          <twitter class="icon" />Sign in with Twitter
        </button>
      </div>
      <router-link class="forgot-password" :to="{ name: 'ForgotPassword' }">
        Forgot your password?
      </router-link>
      <div v-show="error" class="error">
        {{ this.errorMsg }}
      </div>
      <button v-on:click.prevent="signIn">Sign in</button>
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<script>
import email from "../assets/Icons/envelope-regular.svg";
import password from "../assets/Icons/lock-alt-solid.svg";
import facebook from "../assets/Icons/facebook-brands.svg";
import google from "../assets/Icons/google-brands.svg";
import twitter from "../assets/Icons/twitter-brands.svg";
import firebase from "firebase/app";
import "firebase/auth";

function getProviderForProviderId(providerId) {
  if (providerId === "google.com") {
    return new firebase.auth.GoogleAuthProvider();
  } else if (providerId === "facebook.com") {
    return new firebase.auth.FacebookAuthProvider();
  } else if (providerId === "twitter.com") {
    return new firebase.auth.TwitterAuthProvider();
  }
}

// window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '{your-app-id}',
//       cookie     : true,
//       xfbml      : true,
//       version    : '{api-version}'
//     });

//     FB.AppEvents.logPageView();

//   };

// (function(d, s, id){
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) {return;}
//     js = d.createElement(s); js.id = id;
//     js.src = "https://connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));

// FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
// });

export default {
  name: "Login",
  components: {
    email,
    password,
    facebook,
    google,
    twitter
  },
  data() {
    return {
      email: "",
      password: "",
      error: null,
      errorMsg: ""
    };
  },
  methods: {
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          // Signed in
          this.$router.push({ name: "Home" });
          this.error = false;
          this.errorMsg = "";
          console.log(firebase.auth().currentUser.uid);
          //   var user = userCredential.user;
        })
        .catch(err => {
          this.err = true;
          this.err = err.message;
        });
    },
    signInWithProvider(p) {
      var provider = null;
      switch (p) {
        case "google":
          console.log("Log in using google");
          provider = new firebase.auth.GoogleAuthProvider();
          break;
        case "facebook":
          console.log("Log in using facebook");
          provider = new firebase.auth.FacebookAuthProvider();
          break;
        case "twitter":
          console.log("Log in using twitter");
          provider = new firebase.auth.TwitterAuthProvider();
          break;
        default:
          break;
      }
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          if (result.additionalUserInfo.isNewUser) {
            const user = result.user;
            var names = user.displayName.split(" ");
            var firstName = names[0];
            var lastName = names[names.length - 1];
            var username = user.email.split("@")[0];
            // If so, create a new user document in Firestore or Realtime Database
            const db = firebase.firestore();
            // The signed-in user info.
            db.collection("users")
              .doc(user.uid)
              .set({
                username: username,
                email: user.email,
                firstName: firstName,
                lastName: lastName
              })
              .then(() => {
                this.$router.push({ name: "Home" });
                this.error = false;
                this.errorMsg = "";
                console.log("create an new user in firestore");
              });
          } else {
            this.$router.push({ name: "Home" });
            this.error = false;
            this.errorMsg = "";
            console.log(firebase.auth().currentUser.uid);
          }
        })
        .catch(err => {
          if (err.code === "auth/account-exists-with-different-credential") {
            var pendingCred = err.credential;
            // The provider account's email address.
            var email = err.email;
            firebase
              .auth()
              .fetchSignInMethodsForEmail(email)
              .then(methods => {
                // if the user already registered using password and try to login with google
                if (methods[0] === "password") {
                  // In real scenario, you should handle this asynchronously.
                  // var password = promptUserForPassword();
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .then(result => {
                      return result.user.linkWithCredential(pendingCred);
                    })
                    .then(function() {
                      // Google account successfully linked to the existing Firebase user.
                      this.$router.push({ name: "Home" });
                    });
                  return;
                }
                var provider = getProviderForProviderId(methods[0]);
                window.confirm(
                  "You already have an account with " +
                    provider.providerId +
                    ". Do you want to login with " +
                    provider.providerId +
                    " instead?"
                );
                firebase
                  .auth()
                  .signInWithPopup(provider)
                  .then(function(result) {
                    // Remember that the user may have signed in with an account that has a different email
                    // address than the first one. This can happen as Firebase doesn't control the provider's
                    // sign in flow and the user is free to login using whichever account they own.
                    // Step 4b.

                    // Link to Google credential.
                    // As we have access to the pending credential, we can directly call the link method.
                    result.user
                      .linkWithCredential(pendingCred)
                      .then(function() {
                        // Google account successfully linked to the existing Firebase user.
                        this.$router.push({ name: "Home" });
                      });
                  });
              });
          }
          this.error = true;
          this.errorMsg = err.message;
        });
    },
    signInWithFacebook() {},
    signInWithTwitter() {}
  }
};
</script>

<style lang="scss">
.form-wrap {
  overflow: hidden;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-self: center;
  margin: 0 auto;
  width: 90%;
  @media (min-width: 900px) {
    width: 100%;
  }

  .login-register {
    margin-bottom: 32px;

    .router-link {
      color: #000;
    }
  }

  form {
    padding: 0 5px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    @media (max-width: 900px) {
      padding: 0 50px;
    }

    h2 {
      text-align: center;
      font-size: 32px;
      color: #303030;
      margin-bottom: 40px;
      @media (min-width: 900px) {
        font-size: 40px;
      }
    }

    .inputs {
      width: 100%;
      max-width: 350px;

      .input {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 8px;

        input {
          width: 100%;
          height: 50px;
          border: none;
          padding: 4px 4px 4px 30px;
          font-size: 16px;
          background-color: #f2f7f6;

          &:focus {
            outline: none;
          }
        }

        .icon {
          width: 12px;
          position: absolute;
          left: 6px;
        }
      }
    }

    .forgot-password {
      text-decoration: none;
      color: #000;
      cursor: pointer;
      font-size: 14px;
      margin: 16px 0 32px;
      border-bottom: 1px solid transparent;
      transition: 0.5s ease all;

      &:hover {
        border-color: #303030;
      }
    }

    .angle {
      display: none;
      position: absolute;
      background-color: #fff;
      transform: rotateZ(3deg);
      width: 60px;
      right: -30px;
      height: 101%;
      @media (min-width: 900px) {
        display: initial;
      }
    }
  }

  .sign-in-options {
    width: 100%;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    .authenticator {
      width: 100%;
      height: 40px;
      border: none;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #303030;
      cursor: pointer;
      transition: 0.5s ease all;
      border-radius: 4px;
      box-shadow: 0 0 0 1px #303030;

      &:hover {
        background-color: #303030;
        color: #fff;
      }

      .icon {
        width: 20px;
        left: 10px;
        position: absolute;
      }
    }
  }

  .background {
    display: none;
    flex: 2;
    background-size: cover;
    background-image: url("../assets/background.png");
    width: 100%;
    height: 100%;
    @media (min-width: 900px) {
      display: initial;
    }
  }
}
</style>
