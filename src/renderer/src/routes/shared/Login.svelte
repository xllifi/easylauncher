<script lang="ts">
  import { CircleUserRound, KeySquare } from 'lucide-svelte'
  import { _ } from 'svelte-i18n'
  import { onMount } from 'svelte'
  import ky, { HTTPError, TimeoutError } from 'ky'
  import type { DraslApiUser } from '../../lib/types/login.js'
  import { params } from '../../lib/stores/params.svelte.js'
  import { createNotification } from '../../components/StatusFeed.svelte'
  import { ipc } from '../../main.js'
  import type { launchCredentials } from 'xlicore'

  type Props = {
    finishCallback: Function
  }
  let { finishCallback = $bindable() }: Props = $props()

  let username = $state('')
  let password = $state('')

  let usernameInput: HTMLInputElement, passwordInput: HTMLInputElement

  let isUsernameValid: boolean = $state(false)
  let showUsernameInvalid: boolean = $state(false)

  let isPasswordValid: boolean = $state(false)
  let showPasswordInvalid: boolean = $state(false)

  let isLoggingIn: boolean = $state(false)

  function oninputUsername(): void {
    onunfocusUsername()
    isUsernameValid = username.match(/^[a-zA-Z0-9_]{3,16}$/) != null
  }
  function onunfocusUsername(): void {
    showUsernameInvalid = true
  }
  function onkeypressUsername(e: KeyboardEvent): void {
    if (e.key === 'Enter') passwordInput.focus()
  }

  function oninputPassword(): void {
    onunfocusPassword()
    isPasswordValid = password.length > 0
  }
  function onunfocusPassword(): void {
    showPasswordInvalid = true
  }
  function onkeypressPassword(e: KeyboardEvent): void {
    if (e.key === 'Enter') login()
  }

  async function login(): Promise<void> {
    isLoggingIn = true
    $params.successfullLogin = false
    try {
      // Login Drasl
      const resp: DraslApiUser = await ky
        .post(import.meta.env.VITE_AUTH_HOST + '/drasl/api/v2/login', {
          json: {
            username,
            password
          }
        })
        .then((x) => x.json())
      console.log(resp)

      $params.draslApiUser = resp

      // Login authlib
      ipc.send('login-request', {
        username,
        password
      })

      ipc.once('login-response', (_e, { launchCredentials, isError }: { launchCredentials: launchCredentials, isError: boolean }) => {
        if (isError) throw 'unknown'

        console.log('LOGIN FINISH:')
        console.log(launchCredentials)

        $params.shared.launchCredentials = launchCredentials
        createNotification('login-success', { name: resp.user.username })
        finishCallback()
      })
    } catch (err: any) {
      username = ''
      password = ''
      isUsernameValid = false
      isPasswordValid = false
      isLoggingIn = false

      if (err !instanceof Error) return
      switch (err.constructor) {
        case TimeoutError: {
          createNotification('generic-error-timeout', { err: `${err.name} - ${err.message}` })
          break
        }
        case HTTPError: {
          if (err.response.status == 401) {
            createNotification('launch-error-401')
          } else {
            createNotification('login-error-unknown', { err: `${err.name} - ${err.message}` })
          }
          break
        }
        default: {
          createNotification('login-error-unknown', { err: `${err.name} - ${err.message}` })
          break
        }
      }
    }
  }

  onMount(() => {
    usernameInput.focus()
  })
</script>

<!-- TODO: IMPROVE UI -->

<p class="description">Если у тебя нет данных для входа, то их можно найти в [ДОБАВИТЬ ИСТОЧНИК]</p>
<div class="form">
  <div class="textinput" class:incorrect={!isUsernameValid && showUsernameInvalid}>
    <div class="label">
      <CircleUserRound />
      <p>{$_('modal.login.form.username')}</p>
    </div>
    <input type="text" bind:this={usernameInput} bind:value={username} disabled={isLoggingIn} oninput={oninputUsername} onfocusout={onunfocusUsername} onkeypress={onkeypressUsername} />
  </div>
  <div class="textinput" class:incorrect={!isPasswordValid && showPasswordInvalid}>
    <div class="label">
      <KeySquare />
      <p>{$_('modal.login.form.password')}</p>
    </div>
    <input type="password" bind:this={passwordInput} bind:value={password} disabled={isLoggingIn} oninput={oninputPassword} onfocusout={onunfocusPassword} onkeypress={onkeypressPassword} />
  </div>
  <button onclick={login} class="login" disabled={!isUsernameValid || !isPasswordValid || isLoggingIn}>{$_('modal.login.form.action')}</button>
</div>

<style lang="scss">
  p.description {
    padding: 0 4rem;
    text-align: center;
    opacity: 0.7;
    font-size: 0.8rem;
    margin: 0.4rem 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.6rem;
    width: 16rem;

    .textinput {
      display: grid;
      grid-template-columns: 1fr 1fr;

      background-color: #0006;
      padding: 0.4rem;
      outline: solid 2px var(--theme-accent-inactive);
      border-radius: 0.5rem;

      transition:
        color 200ms,
        font-weight 200ms,
        stroke-width 200ms,
        outline 200ms;

      &.incorrect {
        font-weight: 800;
        outline: solid #f55 2px;
        filter: drop-shadow(0 0 1px #b336);

        :global(.lucide) {
          stroke-width: 2.5px;
        }
        *:not(input) {
          color: #f55;
        }
      }

      &:has(> input:disabled) {
        filter: brightness(50%);
      }

      div.label {
        display: flex;
        justify-content: end;
        align-content: end;
        gap: 0.4rem;
        margin-right: 0.6rem;
      }
      input {
        outline: none;
        height: 100%;
        width: 100%;

        position: relative;

        &:focus {
          filter: none;
        }
      }
    }

    button.login {
      width: 100%;
      margin: 0;
      border-radius: 0.5rem;
      font-size: 1rem;
    }
  }
</style>
