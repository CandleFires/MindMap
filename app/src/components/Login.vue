<template>
    <section class="section">
        <div class="login container">
            <label class="label is-large">Login</label>
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
            <div class="field is-grouped is-grouped-centered">
                <p class="control is-centered">
                    <button ref="signin" type="submit" class="button is-success">Sign In</button>
                </p>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { isEmptyString, setDocumentTitle } from '../utility';
import { Mutation } from 'vuex-class';
import Page from '../enums/page';
import Service from '../services/apiService';

@Component
export default class Login extends Vue {
    public usernameNeeded: boolean = false;
    public passwordNeeded: boolean = false;

    @Mutation('login')
    private login!: (params: { username: string, token: string }) => void;
    @Mutation('changePage')
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
    padding: 10px 15px;
    border: 1px solid $border-color;
    background-color: $background-highlight;
}
</style>
