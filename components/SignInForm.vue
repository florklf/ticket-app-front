<template>
    <n-form ref="formRef" :model="formCredentials" :rules="rules" @submit.prevent="handleValidateClick">
        <n-form-item label="Nom d'utilisateur" path="username">
            <n-input v-model:value="formCredentials.username" placeholder="Nom d'utilisateur" />
        </n-form-item>
        <n-form-item label="Mot de passe" path="password">
            <n-input type="password" show-password-on="mousedown" v-model:value="formCredentials.password"  placeholder="Mot de passe" />
        </n-form-item>
        <n-button attr-type="submit" class="my-1">
            Je me connecte
        </n-button>
    </n-form>
</template>

<script setup lang="ts">
import {
    FormInst,
    FormItemRule,
    FormValidationError,
    useMessage
} from 'naive-ui';

const { signIn } = useAuth();
const { query } = useRoute();
const config = useRuntimeConfig();
const message = useMessage();

const formRef = ref<FormInst | null>(null)
const formCredentials = reactive({
    username: '',
    password: '',
    redirect: false
})
const rules = ref({
    username: {
        required: true,
        trigger: 'blur',
        validator: (rule: FormItemRule, value: string) => {
            return new Promise<void>((resolve, reject) => {
                if (value === '') {
                    reject(Error('Le nom d\'utilisateur est requis'))
                } else {
                    resolve()
                }
            })
        }
    },
    password: {
        required: true,
        trigger: 'blur',
        validator: (rule: FormItemRule, value: string) => {
            return new Promise<void>((resolve, reject) => {
                if (value === '') {
                    reject(Error('Le mot de passe est requis'))
                } else {
                    resolve()
                }
            })
        }
    }
})

const handleValidateClick = () => {
    const messageReactive = message.loading('Vérification des informations...', {
        duration: 0,
    })
    formRef.value?.validate(
        (errors: Array<FormValidationError> | undefined) => {
            if (!errors) {
                mySignInHandler()
            } else {
                message.error("Veuillez vérifier les informations saisies.")
            }
            messageReactive.destroy()
        }
    );
}

const mySignInHandler = async () => {
    const { error }: any = await signIn('credentials', formCredentials)
    if (error) {
        message.error('Une erreur est survenue lors de la connexion. Veuillez vérifier les informations saisies.')
    } else {
        const callbackUrl = (query.callbackUrl ?? config.baseURL) as string;
        // No error, continue with the sign in, e.g., by following the returned redirect:
        return navigateTo(callbackUrl, { external: true });
    }
}
</script>