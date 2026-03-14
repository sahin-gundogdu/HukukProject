import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { API_ROUTES } from '@/services/API_ROUTES';
import type {
    GorevDto, GorevDetayDto, CreateGorevRequest, UpdateGorevRequest,
    AltGorevDto, CreateAltGorevRequest, UpdateAltGorevRequest,
    GorevYorumDto, GrupDto, GorevTipiDto, EtiketDto, BildirimDto,
    AyarDto, KullaniciDto, DashboardDto, CommandResponse,
} from '@/types';
import { GorevDurumu, OncelikSeviyesi } from '@/types';

// ===== GOREV =====
interface GorevFilters {
    durum?: GorevDurumu;
    oncelik?: OncelikSeviyesi;
    atananKullaniciId?: number;
    atananGrupId?: number;
    gorevTipiId?: number;
    aramaMetni?: string;
    sadeceGecikenler?: boolean;
}

export function useGorevler(filters?: GorevFilters) {
    return useQuery<GorevDto[]>({
        queryKey: ['gorevler', filters],
        queryFn: async () => {
            const res = await api.get(API_ROUTES.GET_ALL_GOREVLER, { params: filters });
            return res.data;
        },
    });
}

export function useGorev(id: number) {
    return useQuery<GorevDetayDto>({
        queryKey: ['gorev', id],
        queryFn: async () => {
            const res = await api.get(API_ROUTES.GET_GOREV_BY_ID(id));
            return res.data;
        },
        enabled: id > 0,
    });
}

export function useCreateGorev() {
    const qc = useQueryClient();
    return useMutation<CommandResponse, Error, CreateGorevRequest>({
        mutationFn: async (data) => (await api.post(API_ROUTES.CREATE_GOREV, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['gorevler'] }),
    });
}

export function useUpdateGorev() {
    const qc = useQueryClient();
    return useMutation<CommandResponse, Error, UpdateGorevRequest>({
        mutationFn: async (data) => (await api.put(API_ROUTES.UPDATE_GOREV, data)).data,
        onSuccess: (_d, v) => {
            qc.invalidateQueries({ queryKey: ['gorevler'] });
            qc.invalidateQueries({ queryKey: ['gorev', v.id] });
        },
    });
}

export function useDeleteGorev() {
    const qc = useQueryClient();
    return useMutation<CommandResponse, Error, number>({
        mutationFn: async (id) => (await api.delete(API_ROUTES.DELETE_GOREV(id))).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['gorevler'] }),
    });
}

export function useGorevUzerineAl() {
    const qc = useQueryClient();
    return useMutation<boolean, Error, { gorevId: number; kullaniciId: number }>({
        mutationFn: async (data) => (await api.post(API_ROUTES.GOREV_UZERINE_AL, data)).data,
        onSuccess: (_d, v) => {
            qc.invalidateQueries({ queryKey: ['gorevler'] });
            qc.invalidateQueries({ queryKey: ['gorev', v.gorevId] });
        },
    });
}

// ===== ALT GOREV =====
export function useCreateAltGorev() {
    const qc = useQueryClient();
    return useMutation<CommandResponse, Error, CreateAltGorevRequest>({
        mutationFn: async (data) => (await api.post(API_ROUTES.CREATE_ALT_GOREV, data)).data,
        onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['gorev', v.gorevId] }),
    });
}

export function useUpdateAltGorev() {
    const qc = useQueryClient();
    return useMutation<CommandResponse, Error, UpdateAltGorevRequest>({
        mutationFn: async (data) => (await api.put(API_ROUTES.UPDATE_ALT_GOREV, data)).data,
        onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['gorev', v.gorevId] }),
    });
}

export function useDeleteAltGorev(gorevId: number) {
    const qc = useQueryClient();
    return useMutation<CommandResponse, Error, number>({
        mutationFn: async (id) => (await api.delete(API_ROUTES.DELETE_ALT_GOREV(id))).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['gorev', gorevId] }),
    });
}

// ===== YORUM =====
export function useCreateGorevYorum() {
    const qc = useQueryClient();
    return useMutation<GorevYorumDto, Error, { gorevId: number; icerik: string; kullaniciId: number }>({
        mutationFn: async (data) => (await api.post(API_ROUTES.CREATE_GOREV_YORUM, data)).data,
        onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['gorev', v.gorevId] }),
    });
}

// ===== GRUP =====
export function useGruplar() {
    return useQuery<GrupDto[]>({
        queryKey: ['gruplar'],
        queryFn: async () => (await api.get(API_ROUTES.GET_ALL_GRUPLAR)).data,
    });
}

export function useCreateGrup() {
    const qc = useQueryClient();
    return useMutation<GrupDto, Error, { ad: string; aciklama?: string }>({
        mutationFn: async (data) => (await api.post(API_ROUTES.CREATE_GRUP, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['gruplar'] }),
    });
}

export function useUpdateGrup() {
    const qc = useQueryClient();
    return useMutation<GrupDto, Error, { id: number; ad: string; aciklama?: string }>({
        mutationFn: async (data) => (await api.put(API_ROUTES.UPDATE_GRUP, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['gruplar'] }),
    });
}

export function useDeleteGrup() {
    const qc = useQueryClient();
    return useMutation<CommandResponse, Error, number>({
        mutationFn: async (id) => (await api.delete(API_ROUTES.DELETE_GRUP(id))).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['gruplar'] }),
    });
}

// ===== GOREV TIPI =====
export function useGorevTipleri() {
    return useQuery<GorevTipiDto[]>({
        queryKey: ['gorevTipleri'],
        queryFn: async () => (await api.get(API_ROUTES.GET_ALL_GOREV_TIPLERI)).data,
    });
}

export function useCreateGorevTipi() {
    const qc = useQueryClient();
    return useMutation<GorevTipiDto, Error, { ad: string; aciklama?: string }>({
        mutationFn: async (data) => (await api.post(API_ROUTES.CREATE_GOREV_TIPI, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['gorevTipleri'] }),
    });
}

// ===== ETIKET =====
export function useEtiketler() {
    return useQuery<EtiketDto[]>({
        queryKey: ['etiketler'],
        queryFn: async () => (await api.get(API_ROUTES.GET_ALL_ETIKETLER)).data,
    });
}

export function useCreateEtiket() {
    const qc = useQueryClient();
    return useMutation<EtiketDto, Error, { ad: string; renk?: string }>({
        mutationFn: async (data) => (await api.post(API_ROUTES.CREATE_ETIKET, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['etiketler'] }),
    });
}

// ===== BILDIRIM =====
export function useBildirimler(kullaniciId: number, sadeceOkunmamis?: boolean) {
    return useQuery<BildirimDto[]>({
        queryKey: ['bildirimler', kullaniciId, sadeceOkunmamis],
        queryFn: async () => (await api.get(API_ROUTES.GET_BILDIRIMLER, { params: { kullaniciId, sadeceOkunmamis } })).data,
        enabled: kullaniciId > 0,
    });
}

export function useMarkBildirimOkundu() {
    const qc = useQueryClient();
    return useMutation<boolean, Error, number>({
        mutationFn: async (id) => (await api.put(API_ROUTES.MARK_BILDIRIM_OKUNDU(id))).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['bildirimler'] }),
    });
}

// ===== AYAR =====
export function useAyarlar() {
    return useQuery<AyarDto[]>({
        queryKey: ['ayarlar'],
        queryFn: async () => (await api.get(API_ROUTES.GET_ALL_AYARLAR)).data,
    });
}

export function useUpdateAyar() {
    const qc = useQueryClient();
    return useMutation<AyarDto, Error, { id: number; deger: string }>({
        mutationFn: async (data) => (await api.put(API_ROUTES.UPDATE_AYAR, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['ayarlar'] }),
    });
}

// ===== KULLANICI =====
export function useKullanicilar() {
    return useQuery<KullaniciDto[]>({
        queryKey: ['kullanicilar'],
        queryFn: async () => (await api.get(API_ROUTES.GET_ALL_KULLANICILAR)).data,
    });
}

export function useRegisterKullanici() {
    const qc = useQueryClient();
    return useMutation<CommandResponse, Error, any>({
        mutationFn: async (data) => (await api.post(API_ROUTES.REGISTER, data)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['kullanicilar'] }),
    });
}

// ===== DASHBOARD =====
export function useDashboard(kullaniciId?: number, grupId?: number) {
    return useQuery<DashboardDto>({
        queryKey: ['dashboard', kullaniciId, grupId],
        queryFn: async () => (await api.get(API_ROUTES.GET_DASHBOARD, { params: { kullaniciId, grupId } })).data,
    });
}
