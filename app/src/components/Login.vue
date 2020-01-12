<template>
    <section class="section">
        <div class="login container">
            <label class="label is-large title">
                <span class="logo">
                    <img src="images/CandleFire.png" alt="CandleFire">
                </span>
                Login
            </label>
            <div class="login-content">
                <div class="field">
                    <p class="control has-icons-left">
                        <input ref="username" class="input" type="text" name="username" placeholder="Username" :class="{ 'is-danger': usernameNeeded }">
                        <span class="icon is-small is-left">
                            <i class="fas fa-user"></i>
                        </span>
                        <p v-show="usernameNeeded" class="help is-danger">
                            Username is required
                        </p>
                    </p>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input ref="password" class="input" type="password" name="password" placeholder="Password" :class="{ 'is-danger': passwordNeeded }">
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                        <p v-show="passwordNeeded" class="help is-danger">
                            Password is required
                        </p>
                    </p>
                </div>
                    <div class="field is-grouped is-grouped-right">
                        <p class="control">
                            <button ref="signin" type="submit" class="button is-primary">Sign In</button>
                        </p>
                    </div>
                </div>
            </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { isEmptyString, setDocumentTitle } from '../utility';
import { Mutation, Action } from 'vuex-class';
import Page from '../enums/page';
import Service from '../services/apiService';

@Component
export default class Login extends Vue {
    public usernameNeeded: boolean = false;
    public passwordNeeded: boolean = false;

    @Mutation('login')
    private login!: (params: { username: string, token: string }) => void;
    @Action('changePage')
    private changePage!: (page: Page) => void;

    private mounted () {
        (this.$refs.username as HTMLInputElement).addEventListener('keypress', this.handleEnterPresssed);
        (this.$refs.password as HTMLInputElement).addEventListener('keypress', this.handleEnterPresssed);
        (this.$refs.signin as HTMLButtonElement).addEventListener('click', this.validateAndLogin);
        setDocumentTitle('Login');
    }

    private beforeDestroy() {
        (this.$refs.username as HTMLInputElement).removeEventListener('keypress', this.handleEnterPresssed);
        (this.$refs.password as HTMLInputElement).removeEventListener('keypress', this.handleEnterPresssed);
        (this.$refs.signin as HTMLButtonElement).removeEventListener('click', this.validateAndLogin);
    }

    private handleEnterPresssed(event: KeyboardEvent) {
        if (event.key === "Enter") {
            this.validateAndLogin();
        }
    }

    private async validateAndLogin() {
        const username = (this.$refs.username as HTMLInputElement).value;
        const password = (this.$refs.password as HTMLInputElement).value;

        if (this.validateInput(username, password)) {
            const singInButton = this.$refs.signin as HTMLButtonElement;

            singInButton.classList.add('is-loading');
            const response = await Service.post('/login', {
                data: { username }
            }, true);
            singInButton.classList.remove('is-loading');
            this.login({ username, token: response.data.token });
            this.changePage(Page.MapList);
        }
    }

    private validateInput (username: string, password: string): boolean {
        this.usernameNeeded = isEmptyString(username);
        this.passwordNeeded = isEmptyString(password);

        return !(this.usernameNeeded || this.passwordNeeded);
    }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.section {
    flex: 1 1 auto;
}
.login {
    width: 400px;
    max-width: 90vw;
    padding: 0;
    border: 1px solid $border-color;
    background-color: $background-highlight;
    .title {
        .logo {
            img {
                height: 1em;
                vertical-align: top;
                -webkit-filter: drop-shadow(1px 1px 0 $text-color)
                        drop-shadow(-1px 1px 0 $text-color)
                        drop-shadow(1px -1px 0 $text-color)
                        drop-shadow(-1px -1px 0 $text-color);
                filter: drop-shadow(1px 1px 0 $text-color)
                        drop-shadow(-1px 1px 0 $text-color)
                        drop-shadow(1px -1px 0 $text-color)
                        drop-shadow(-1px -1px 0 $text-color);
            }
        }
        padding: 10px 15px;
        background-color: $primary;
        color: $text-light;
    }
    &-content {
        padding: 0 15px 10px;
    }
}
</style>
