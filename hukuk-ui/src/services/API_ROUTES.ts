export const API_ROUTES = {
    // Auth
    LOGIN: '/Kullanici/Login',
    REGISTER: '/Kullanici/Register',
    GET_ALL_KULLANICILAR: '/Kullanici/GetAllKullanicilar',

    // Gorev
    CREATE_GOREV: '/Gorev/CreateGorev',
    UPDATE_GOREV: '/Gorev/UpdateGorev',
    DELETE_GOREV: (id: number) => `/Gorev/DeleteGorev/${id}`,
    GET_GOREV_BY_ID: (id: number) => `/Gorev/GetGorevById/${id}`,
    GET_ALL_GOREVLER: '/Gorev/GetAllGorevler',
    GOREV_UZERINE_AL: '/Gorev/GorevUzerineAl',

    // AltGorev
    CREATE_ALT_GOREV: '/AltGorev/CreateAltGorev',
    UPDATE_ALT_GOREV: '/AltGorev/UpdateAltGorev',
    DELETE_ALT_GOREV: (id: number) => `/AltGorev/DeleteAltGorev/${id}`,

    // GorevYorum
    CREATE_GOREV_YORUM: '/GorevYorum/CreateGorevYorum',

    // Grup
    GET_ALL_GRUPLAR: '/Grup/GetAllGruplar',
    CREATE_GRUP: '/Grup/CreateGrup',
    UPDATE_GRUP: '/Grup/UpdateGrup',
    DELETE_GRUP: (id: number) => `/Grup/DeleteGrup/${id}`,

    // GorevTipi
    GET_ALL_GOREV_TIPLERI: '/GorevTipi/GetAllGorevTipleri',
    CREATE_GOREV_TIPI: '/GorevTipi/CreateGorevTipi',

    // Etiket
    GET_ALL_ETIKETLER: '/Etiket/GetAllEtiketler',
    CREATE_ETIKET: '/Etiket/CreateEtiket',

    // Bildirim
    GET_BILDIRIMLER: '/Bildirim/GetBildirimler',
    MARK_BILDIRIM_OKUNDU: (id: number) => `/Bildirim/MarkOkundu/${id}`,

    // Ayar
    GET_ALL_AYARLAR: '/Ayar/GetAllAyarlar',
    UPDATE_AYAR: '/Ayar/UpdateAyar',

    // Dashboard
    GET_DASHBOARD: '/Dashboard/GetDashboard',
};
