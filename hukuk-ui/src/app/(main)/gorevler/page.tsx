'use client';
import React, { useState, useEffect } from 'react';
import { useGorevler, useDeleteGorev, useGorev, useDeleteAltGorev, useUpdateAltGorev } from '@/layout/hooks/useApi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { SelectButton } from 'primereact/selectbutton';
import { GorevDurumu, OncelikSeviyesi, GorevDto, AltGorevDto, AtamaTipi } from '@/types';
import { DURUM_LABELS, DURUM_SEVERITY, ONCELIK_LABELS, ONCELIK_SEVERITY, formatDate, isOverdue } from '@/utils/formatters';
import GorevForm from './GorevForm';
import KanbanBoard from './KanbanBoard';
import AltGorevForm from './AltGorevForm';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { saveAs } from 'file-saver';

type ViewMode = 'liste' | 'kanban';

const VIEW_OPTIONS = [
    { label: 'Liste', value: 'liste', icon: 'pi pi-list' },
];

// Alt görev satırını gösteren bileşen (lazy load ile gorev detayını çeker)
function AltGorevExpander({ gorevId }: { gorevId: number }) {
    const { data: gorev, isLoading } = useGorev(gorevId);
    const deleteAltGorev = useDeleteAltGorev(gorevId);
    const updateAltGorev = useUpdateAltGorev();
    const [editingAltGorev, setEditingAltGorev] = useState<AltGorevDto | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);

    const handleDeleteAltGorev = (id: number) => {
        confirmDialog({
            message: 'Bu alt görevi silmek istediğinizden emin misiniz?',
            header: 'Alt Görev Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil',
            rejectLabel: 'İptal',
            accept: () => deleteAltGorev.mutate(id),
        });
    };

    const handleToggleDurum = async (ag: AltGorevDto) => {
        const yeniDurum = ag.durum === GorevDurumu.Tamamlandi ? GorevDurumu.DevamEdiyor : GorevDurumu.Tamamlandi;
        await updateAltGorev.mutateAsync({
            id: ag.id,
            gorevId,
            baslik: ag.baslik,
            aciklama: ag.aciklama,
            durum: yeniDurum,
            atamaTipi: ag.atamaTipi ?? AtamaTipi.Kisi,
            atananKullaniciId: ag.atananKullaniciId,
            atananGrupId: ag.atananGrupId,
            tahminibitisTarihi: ag.tahminibitisTarihi,
            tamamlanmaTarihi: yeniDurum === GorevDurumu.Tamamlandi ? new Date().toISOString() : undefined,
        });
    };

    if (isLoading) {
        return (
            <div style={{ padding: '16px 40px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <ProgressSpinner style={{ width: '20px', height: '20px' }} />
                <span style={{ fontSize: '0.85rem' }}>Alt görevler yükleniyor...</span>
            </div>
        );
    }

    const altGorevler = gorev?.altGorevler ?? [];

    return (
        <div style={{ padding: '12px 16px 12px 48px', background: 'var(--surface-50)', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <i className="pi pi-list" style={{ marginRight: '6px' }} />
                    Alt Görevler
                </span>
                <Button
                    label="Alt Görev Ekle"
                    icon="pi pi-plus"
                    className="p-button-text p-button-sm"
                    style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                    onClick={() => setShowAddDialog(true)}
                />
            </div>

            {altGorevler.length === 0 ? (
                <div style={{ padding: '10px 0', color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Henüz alt görev yok.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {altGorevler.map(ag => (
                        <div key={ag.id} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '8px 12px',
                            background: 'var(--surface-0)',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            transition: 'background 0.15s',
                        }}>
                            {/* Tamamlandı toggle */}
                            <Button
                                icon={ag.durum === GorevDurumu.Tamamlandi ? 'pi pi-check-circle' : 'pi pi-circle'}
                                className="p-button-text p-button-sm"
                                style={{
                                    color: ag.durum === GorevDurumu.Tamamlandi ? 'var(--success)' : 'var(--surface-400)',
                                    padding: '2px',
                                    fontSize: '1rem',
                                }}
                                tooltip={ag.durum === GorevDurumu.Tamamlandi ? 'Tamamlandı — geri al' : 'Tamamlandı olarak işaretle'}
                                onClick={() => handleToggleDurum(ag)}
                                loading={updateAltGorev.isPending}
                            />

                            {/* Başlık */}
                            <span style={{
                                flex: 1,
                                fontWeight: 500,
                                fontSize: '0.88rem',
                                textDecoration: ag.durum === GorevDurumu.Tamamlandi ? 'line-through' : 'none',
                                color: ag.durum === GorevDurumu.Tamamlandi ? 'var(--text-secondary)' : 'inherit',
                            }}>
                                {ag.baslik}
                            </span>

                            {/* Açıklama */}
                            {ag.aciklama && (
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                    title={ag.aciklama}>
                                    {ag.aciklama}
                                </span>
                            )}

                            {/* Durum tag */}
                            <Tag value={DURUM_LABELS[ag.durum]} severity={DURUM_SEVERITY[ag.durum] as any} style={{ fontSize: '0.72rem' }} />

                            {/* Atanan */}
                            {(ag.atananKullaniciAdi || ag.atananGrupAdi) && (
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <i className={(ag.atamaTipi ?? AtamaTipi.Kisi) === AtamaTipi.Grup ? 'pi pi-users' : 'pi pi-user'} />
                                    {ag.atananKullaniciAdi ?? ag.atananGrupAdi}
                                </span>
                            )}

                            {/* Tarih */}
                            {ag.tahminibitisTarihi && (
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <i className="pi pi-calendar" />
                                    {formatDate(ag.tahminibitisTarihi)}
                                </span>
                            )}

                            {/* Eylemler */}
                            <div style={{ display: 'flex', gap: '2px' }}>
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-text p-button-sm"
                                    style={{ padding: '4px' }}
                                    tooltip="Düzenle"
                                    onClick={() => { setEditingAltGorev(ag); setShowEditDialog(true); }}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-text p-button-sm p-button-danger"
                                    style={{ padding: '4px' }}
                                    tooltip="Sil"
                                    onClick={() => handleDeleteAltGorev(ag.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Alt görev ekleme dialog */}
            <Dialog header="Alt Görev Ekle" visible={showAddDialog}
                onHide={() => setShowAddDialog(false)} style={{ width: '500px' }} modal blockScroll>
                <AltGorevForm gorevId={gorevId} onClose={() => setShowAddDialog(false)} />
            </Dialog>

            {/* Alt görev düzenleme dialog */}
            <Dialog header="Alt Görevi Düzenle" visible={showEditDialog}
                onHide={() => { setShowEditDialog(false); setEditingAltGorev(null); }} style={{ width: '500px' }} modal blockScroll>
                {editingAltGorev && (
                    <AltGorevForm
                        gorevId={gorevId}
                        altGorev={editingAltGorev}
                        onClose={() => { setShowEditDialog(false); setEditingAltGorev(null); }}
                    />
                )}
            </Dialog>
        </div>
    );
}

export default function GorevlerPage() {
    const [viewMode, setViewMode] = useState<ViewMode>('liste');
    const [filters, setFilters] = useState<any>({});
    const [aramaMetni, setAramaMetni] = useState('');
    const [debouncedAramaMetni, setDebouncedAramaMetni] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedGorev, setSelectedGorev] = useState<GorevDto | null>(null);
    const [expandedRows, setExpandedRows] = useState<any>({});

    // Debounce effect: Wait for 500ms after last keystroke before triggering search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedAramaMetni(aramaMetni);
        }, 500);

        return () => clearTimeout(handler);
    }, [aramaMetni]);

    const { data: gorevler, isLoading } = useGorevler({ ...filters, aramaMetni: debouncedAramaMetni || undefined });

    const formatExportData = () => {
        return (gorevler || []).map(g => ({
            baslik: g.baslik,
            durum: DURUM_LABELS[g.durum],
            oncelik: ONCELIK_LABELS[g.oncelik],
            atanan: g.atananKullaniciAdi ?? g.atananGrupAdi ?? '-',
            tip: g.gorevTipiAdi ?? '-',
            baslangic: formatDate(g.baslangicTarihi),
            bitis: formatDate(g.bitisTarihi)
        }));
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const data = formatExportData();
            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = { Sheets: { 'Görevler': worksheet }, SheetNames: ['Görevler'] };
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAsExcelFile(excelBuffer, 'gorevler');
        });
    };

    const saveAsExcelFile = (buffer: any, fileName: string) => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then((autoTable) => {
                const doc = new jsPDF.default('l', 'mm', 'a4');
                const data = formatExportData();
                const columns = [
                    { header: 'Başlık', dataKey: 'baslik' },
                    { header: 'Durum', dataKey: 'durum' },
                    { header: 'Öncelik', dataKey: 'oncelik' },
                    { header: 'Atanan', dataKey: 'atanan' },
                    { header: 'Tip', dataKey: 'tip' },
                    { header: 'Başlangıç', dataKey: 'baslangic' },
                    { header: 'Bitiş', dataKey: 'bitis' }
                ];

                autoTable.default(doc, {
                    columns: columns,
                    body: data,
                    headStyles: { fillColor: [30, 58, 95] },
                    styles: { fontSize: 8 }
                });

                doc.save(`gorevler_export_${new Date().getTime()}.pdf`);
            });
        });
    };

    const dtHeader = (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '10px' }}>
            <Button type="button" icon="pi pi-file-excel" className="p-button-success p-button-rounded" onClick={exportExcel} tooltip="Excel İndir" />
            <Button type="button" icon="pi pi-file-pdf" className="p-button-danger p-button-rounded" onClick={exportPdf} tooltip="PDF İndir" />
        </div>
    );

    const deleteGorev = useDeleteGorev();

    const durumOptions = Object.values(GorevDurumu).filter(v => typeof v === 'number').map(v => ({
        label: DURUM_LABELS[v as GorevDurumu], value: v,
    }));
    const oncelikOptions = Object.values(OncelikSeviyesi).filter(v => typeof v === 'number').map(v => ({
        label: ONCELIK_LABELS[v as OncelikSeviyesi], value: v,
    }));

    const handleDelete = (id: number) => {
        confirmDialog({
            message: 'Bu görevi silmek istediğinizden emin misiniz?',
            header: 'Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Evet, Sil',
            rejectLabel: 'İptal',
            accept: () => deleteGorev.mutate(id),
        });
    };

    const oncelikTemplate = (row: GorevDto) => (
        <Tag value={ONCELIK_LABELS[row.oncelik]} severity={ONCELIK_SEVERITY[row.oncelik] as any} />
    );

    const durumTemplate = (row: GorevDto) => (
        <Tag value={DURUM_LABELS[row.durum]} severity={DURUM_SEVERITY[row.durum] as any} style={{ whiteSpace: 'nowrap' }} />
    );

    const baslikTemplate = (row: GorevDto) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Expand/collapse butonu — alt görev varsa göster */}
            {row.altGorevSayisi > 0 ? (
                <Button
                    icon={expandedRows[row.id] ? 'pi pi-chevron-down' : 'pi pi-chevron-right'}
                    className="p-button-rounded p-button-text p-button-sm"
                    style={{ 
                        width: '24px', 
                        height: '24px', 
                        padding: 0,
                        color: 'var(--primary-color)', 
                        border: '1px solid var(--primary-100)',
                        backgroundColor: 'var(--primary-50)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem'
                    }}
                    tooltip={expandedRows[row.id] ? 'Alt görevleri gizle' : `${row.altGorevSayisi} alt görev`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpandedRows((prev: any) => {
                            const next = { ...prev };
                            if (next[row.id]) delete next[row.id];
                            else next[row.id] = true;
                            return next;
                        });
                    }}
                />
            ) : (
                <span style={{ width: '28px', flexShrink: 0 }} />
            )}
            <div>
                <Link href={`/gorevler/${row.id}`} style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
                    {row.baslik}
                </Link>
                {row.altGorevSayisi > 0 && (
                    <span style={{ marginLeft: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--surface-200)', padding: '1px 6px', borderRadius: '10px' }}>
                        {row.altGorevSayisi} alt görev
                    </span>
                )}
                {isOverdue(row.bitisTarihi, row.durum) && (
                    <span className="overdue-badge" style={{ marginLeft: '8px', fontSize: '0.7rem' }}>
                        <i className="pi pi-clock" /> Gecikmiş
                    </span>
                )}
            </div>
        </div>
    );

    const atananTemplate = (row: GorevDto) => (
        <span>{row.atananKullaniciAdi ?? row.atananGrupAdi ?? '-'}</span>
    );

    const etiketTemplate = (row: GorevDto) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {row.etiketler?.map((e, i) => (
                <Tag key={i} value={e} style={{ fontSize: '0.7rem', background: 'var(--surface-200)', color: 'var(--surface-700)' }} />
            ))}
        </div>
    );

    const actionTemplate = (row: GorevDto) => (
        <div style={{ display: 'flex', gap: '4px' }}>
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" tooltip="Düzenle"
                onClick={() => { setSelectedGorev(row); setShowForm(true); }} />
            <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger" tooltip="Sil"
                onClick={() => handleDelete(row.id)} />
        </div>
    );

    const viewOptionTemplate = (option: any) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className={option.icon} />
            {option.label}
        </span>
    );

    // Expandable row body template
    const rowExpansionTemplate = (row: GorevDto) => {
        if (!expandedRows[row.id]) return null;
        return <AltGorevExpander gorevId={row.id} />;
    };

    // DataTable expandedRows objesi için dönüştürme
    const dtExpandedRows = Object.keys(expandedRows)
        .filter(k => expandedRows[k])
        .reduce((acc: any, k) => {
            const gorev = gorevler?.find(g => g.id === Number(k));
            if (gorev) acc[k] = true;
            return acc;
        }, {});
    return (
        <div>
            <ConfirmDialog />
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-list-check" /> Görevler</h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <SelectButton
                        value={viewMode}
                        onChange={(e) => setViewMode(e.value)}
                        options={VIEW_OPTIONS}
                        itemTemplate={viewOptionTemplate}
                        className="view-toggle"
                    />
                    <Button label="Yeni Görev" icon="pi pi-plus" onClick={() => { setSelectedGorev(null); setShowForm(true); }} />
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Arama</label>
                        <InputText value={aramaMetni} onChange={e => setAramaMetni(e.target.value)}
                            placeholder="Görev ara..." style={{ width: '100%' }} />
                    </div>
                    {viewMode === 'liste' && (
                        <>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Durum</label>
                                <Dropdown value={filters.durum} options={durumOptions}
                                    onChange={e => setFilters({ ...filters, durum: e.value })}
                                    placeholder="Tümü" showClear style={{ minWidth: '160px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Öncelik</label>
                                <Dropdown value={filters.oncelik} options={oncelikOptions}
                                    onChange={e => setFilters({ ...filters, oncelik: e.value })}
                                    placeholder="Tümü" showClear style={{ minWidth: '160px' }} />
                            </div>
                        </>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', height: '38.5px' }}>
                        <Button
                            icon="pi pi-filter-slash"
                            className="p-button-outlined p-button-danger p-button-sm"
                            tooltip="Filtreleri Temizle"
                            onClick={() => { setFilters({}); setAramaMetni(''); }}
                            style={{ height: '38.5px' }}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area with Loading Indicator */}
            <div style={{ position: 'relative', minHeight: '400px' }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(255,255,255,0.5)', zIndex: 10,
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        borderRadius: 'var(--radius)', backdropFilter: 'blur(2px)'
                    }}>
                        <ProgressSpinner />
                    </div>
                )}

                {viewMode === 'liste' ? (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <DataTable
                            value={gorevler}
                            header={dtHeader}
                            paginator rows={15}
                            stripedRows
                            emptyMessage="Görev bulunamadı."
                            rowHover
                            sortField="createdAt"
                            sortOrder={-1}
                            style={{ borderRadius: 'var(--radius)' }}
                            rowExpansionTemplate={rowExpansionTemplate}
                            expandedRows={dtExpandedRows}
                            dataKey="id"
                        >
                            <Column body={baslikTemplate} header="Başlık" sortField="baslik" sortable style={{ minWidth: '250px' }} />
                            <Column body={durumTemplate} header="Durum" sortField="durum" sortable style={{ width: '130px' }} />
                            <Column body={oncelikTemplate} header="Öncelik" sortField="oncelik" sortable style={{ width: '110px' }} />
                            <Column body={atananTemplate} header="Atanan" style={{ width: '160px' }} />
                            <Column field="gorevTipiAdi" header="Tip" style={{ width: '120px' }} />
                            <Column body={etiketTemplate} header="Etiketler" style={{ width: '180px' }} />
                            <Column body={(row: GorevDto) => formatDate(row.baslangicTarihi)} header="Başlangıç" sortField="baslangicTarihi" sortable style={{ width: '110px' }} />
                            <Column body={(row: GorevDto) => formatDate(row.bitisTarihi)} header="Bitiş" sortField="bitisTarihi" sortable style={{ width: '110px' }} />
                            <Column body={actionTemplate} header="" style={{ width: '90px' }} />
                        </DataTable>
                    </div>
                ) : (
                    <KanbanBoard gorevler={gorevler || []} />
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog header={selectedGorev ? 'Görev Düzenle' : 'Yeni Görev'} visible={showForm}
                onHide={() => setShowForm(false)} style={{ width: '700px' }} modal blockScroll>
                <GorevForm gorev={selectedGorev} onClose={() => setShowForm(false)} />
            </Dialog>
        </div>
    );
}
