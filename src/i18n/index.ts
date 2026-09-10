import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      app: {
        title: '🌱 Plant Tracker',
      },
      nav: {
        soil: 'Soil',
        hydroponic: 'Hydroponic',
        plants: 'Plants',
        profile: 'Profile',
      },
      login: {
        signin_title: 'Sign in to your account',
        signup_title: 'Create a new account',
        email: 'Email',
        password: 'Password',
        signin_btn: 'Sign in',
        signup_btn: 'Sign up',
        no_account: "Don't have an account? ",
        has_account: 'Already have an account? ',
        check_email: 'Check your email to confirm your account, then sign in.',
      },
      status: {
        seedling: 'Seedling',
        planting: 'Planting',
        harvested: 'Harvested',
        all: 'All',
      },
      card: {
        planted: 'Planted:',
        target_harvest: 'Target harvest:',
        unknown_plant: 'Unknown plant',
        takes_days: '{{name}} usually takes ~{{days}} days to harvest.',
        notes: 'Notes',
      },
      logs: {
        no_logs: 'No logs yet. Tap + to add your first {{title}} log.',
        add: 'Add',
      },
      plants: {
        title: 'Plants',
        no_plants: 'No plants yet. Tap + to add your first plant.',
        add: 'Add',
      },
      profile: {
        title: 'Profile',
        language: 'Language',
        logout: 'Log out',
        english: 'English',
        indonesian: 'Bahasa Indonesia',
      },
      log_form: {
        new_title: 'New log',
        edit_title: 'Edit log',
        plant: 'Plant',
        select_plant: 'Select a plant',
        status: 'Status',
        plant_date: 'Plant date',
        target_harvest_date: 'Target harvest date',
        notes: 'Notes',
        cancel: 'Cancel',
        save: 'Save',
        fill_error: 'Please fill in plant, plant date, and target harvest date.',
      },
      plant_form: {
        new_title: 'New plant',
        edit_title: 'Edit plant',
        upload_photo: 'Upload photo',
        change_photo: 'Change photo',
        name: 'Plant name',
        name_placeholder: 'e.g. Cherry Tomato',
        days: 'Estimated harvest (days)',
        days_placeholder: 'e.g. 60',
        notes: 'Notes',
        cancel: 'Cancel',
        save: 'Save',
        fill_error: 'Please fill in plant name and estimated harvest days.',
      },
      status_dialog: {
        title: 'Plant log',
        current_status: 'Current status:',
        change_to: 'Change status to',
        already_harvested: 'This log is already marked as Harvested.',
        edit_details: 'Edit details',
        close: 'Close',
        confirm: 'Confirm',
      },
      filter: {
        filter: 'Filter',
        status: 'Status',
        plant_date: 'Plant date',
        harvest_date: 'Harvest date',
        clear: 'Clear filters',
        apply: 'Apply',
      },
    },
  },
  id: {
    translation: {
      app: {
        title: '🌱 Plant Tracker',
      },
      nav: {
        soil: 'Tanah',
        hydroponic: 'Hidroponik',
        plants: 'Tanaman',
        profile: 'Profil',
      },
      login: {
        signin_title: 'Masuk ke akun Anda',
        signup_title: 'Buat akun baru',
        email: 'Email',
        password: 'Kata Sandi',
        signin_btn: 'Masuk',
        signup_btn: 'Daftar',
        no_account: 'Belum punya akun? ',
        has_account: 'Sudah punya akun? ',
        check_email: 'Periksa email Anda untuk mengonfirmasi akun, lalu masuk.',
      },
      status: {
        seedling: 'Semaian',
        planting: 'Penanaman',
        harvested: 'Dipanen',
        all: 'Semua',
      },
      card: {
        planted: 'Ditanam:',
        target_harvest: 'Target panen:',
        unknown_plant: 'Tanaman tidak dikenal',
        takes_days: '{{name}} biasanya butuh ~{{days}} hari untuk dipanen.',
        notes: 'Catatan',
      },
      logs: {
        no_logs: 'Belum ada log. Ketuk + untuk menambah log {{title}} pertama Anda.',
        add: 'Tambah',
      },
      plants: {
        title: 'Tanaman',
        no_plants: 'Belum ada tanaman. Ketuk + untuk menambah tanaman pertama Anda.',
        add: 'Tambah',
      },
      profile: {
        title: 'Profil',
        language: 'Bahasa',
        logout: 'Keluar',
        english: 'English',
        indonesian: 'Bahasa Indonesia',
      },
      log_form: {
        new_title: 'Log baru',
        edit_title: 'Edit log',
        plant: 'Tanaman',
        select_plant: 'Pilih tanaman',
        status: 'Status',
        plant_date: 'Tanggal tanam',
        target_harvest_date: 'Target tanggal panen',
        notes: 'Catatan',
        cancel: 'Batal',
        save: 'Simpan',
        fill_error: 'Silakan isi tanaman, tanggal tanam, dan target tanggal panen.',
      },
      plant_form: {
        new_title: 'Tanaman baru',
        edit_title: 'Edit tanaman',
        upload_photo: 'Unggah foto',
        change_photo: 'Ganti foto',
        name: 'Nama tanaman',
        name_placeholder: 'mis. Tomat Ceri',
        days: 'Estimasi panen (hari)',
        days_placeholder: 'mis. 60',
        notes: 'Catatan',
        cancel: 'Batal',
        save: 'Simpan',
        fill_error: 'Silakan isi nama tanaman dan estimasi hari panen.',
      },
      status_dialog: {
        title: 'Log tanaman',
        current_status: 'Status saat ini:',
        change_to: 'Ubah status ke',
        already_harvested: 'Log ini sudah ditandai sebagai Dipanen.',
        edit_details: 'Edit detail',
        close: 'Tutup',
        confirm: 'Konfirmasi',
      },
      filter: {
        filter: 'Filter',
        status: 'Status',
        plant_date: 'Tanggal tanam',
        harvest_date: 'Tanggal panen',
        clear: 'Hapus filter',
        apply: 'Terapkan',
      },
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
