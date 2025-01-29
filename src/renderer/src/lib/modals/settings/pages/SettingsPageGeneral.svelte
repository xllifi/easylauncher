<script lang="ts">
  import { _, locale } from 'svelte-i18n'
  import { route, type RouteModal } from '../../../stores/route.svelte.js'
  import OptionButton from '../components/OptionButton.svelte'
  import OptionDropdown from '../components/OptionDropdown.svelte'
  import { params } from '../../../stores/params.svelte.js'
  import SettingsModal from '../SettingsModal.svelte'
  import ModpackModal from '../../ModpackModal.svelte'
  import LoginModal from '../../LoginModal.svelte'

  function goTo(page: RouteModal) {
    $route.modal.previous = SettingsModal
    $route.modal.current = page
  }

  function handleLocaleChange(newLocal: string) {
    $route.modal.previous = null
    $route.modal.current = null
    $route.loaded = false
    locale.set(newLocal)
    $params.lang = newLocal
    setTimeout(() => {
      $route.loaded = true
    }, 1000)
  }
</script>

<main>
  <OptionButton name={$_('modal.settings.pages.general.options.login.name')} description={$_('modal.settings.pages.general.options.login.description')} actionLabel={$_('modal.settings.pages.general.options.login.label')} onclick={() => {goTo(LoginModal)}} />
  <OptionButton name={$_('modal.settings.pages.general.options.modpack.name')} description={$_('modal.settings.pages.general.options.modpack.description')} actionLabel={$_('modal.settings.pages.general.options.modpack.label')} onclick={() => {goTo(ModpackModal)}} />
  <OptionDropdown name={$_('modal.settings.pages.general.options.language.name')} description={$_('modal.settings.pages.general.options.language.description')} actionLabel={$_('modal.settings.pages.general.options.language.label')} onclick={() => {}} options={[
    {
      name: `${$_('meta.langnames.ru')} (Русский)`,
      action: () => {handleLocaleChange('ru')}
    },
    {
      name: `${$_('meta.langnames.en')} (English)`,
      action: () => {handleLocaleChange('en')}
    }
  ]} />
</main>
