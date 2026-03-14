'use client';
import React, { useState, useCallback } from 'react';
import { GorevDto, GorevDurumu } from '@/types';
import { useUpdateGorev } from '@/layout/hooks/useApi';
import { DURUM_LABELS } from '@/utils/formatters';
import KanbanCard from './KanbanCard';
import { Toast } from 'primereact/toast';

interface KanbanBoardProps {
    gorevler: GorevDto[];
}

interface ColumnConfig {
    durum: GorevDurumu;
    label: string;
    color: string;
    bgColor: string;
    icon: string;
}

const COLUMNS: ColumnConfig[] = [
    {
        durum: GorevDurumu.YeniAtandi,
        label: 'Yeni Atandı',
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.08)',
        icon: 'pi pi-inbox',
    },
    {
        durum: GorevDurumu.DevamEdiyor,
        label: 'Devam Ediyor',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.08)',
        icon: 'pi pi-spinner',
    },
    {
        durum: GorevDurumu.Beklemede,
        label: 'Beklemede',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.08)',
        icon: 'pi pi-pause',
    },
    {
        durum: GorevDurumu.Tamamlandi,
        label: 'Tamamlandı',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.08)',
        icon: 'pi pi-check-circle',
    },
    {
        durum: GorevDurumu.Iptal,
        label: 'İptal',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.08)',
        icon: 'pi pi-times-circle',
    },
];

export default function KanbanBoard({ gorevler }: KanbanBoardProps) {
    const [dragOverColumn, setDragOverColumn] = useState<GorevDurumu | null>(null);
    const updateGorev = useUpdateGorev();
    const toastRef = React.useRef<Toast>(null);

    const getColumnTasks = useCallback(
        (durum: GorevDurumu) => gorevler.filter((g) => g.durum === durum),
        [gorevler]
    );

    const handleDragStart = (e: React.DragEvent, gorev: GorevDto) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            id: gorev.id,
            baslik: gorev.baslik,
            aciklama: gorev.aciklama,
            oncelik: gorev.oncelik,
            durum: gorev.durum,
            atamaTipi: gorev.atananGrupId ? 1 : 0,
            bitisTarihi: gorev.bitisTarihi,
            gorevTipiId: gorev.gorevTipiId,
            atananKullaniciId: gorev.atananKullaniciId,
            atananGrupId: gorev.atananGrupId,
            etiketIds: [],
        }));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, durum: GorevDurumu) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(durum);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = async (e: React.DragEvent, targetDurum: GorevDurumu) => {
        e.preventDefault();
        setDragOverColumn(null);

        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));

            if (data.durum === targetDurum) return;

            const updateData = {
                ...data,
                durum: targetDurum,
                tamamlanmaTarihi: targetDurum === GorevDurumu.Tamamlandi
                    ? new Date().toISOString()
                    : undefined,
            };

            await updateGorev.mutateAsync(updateData);

            toastRef.current?.show({
                severity: 'success',
                summary: 'Durum Güncellendi',
                detail: `"${data.baslik}" → ${DURUM_LABELS[targetDurum]}`,
                life: 3000,
            });
        } catch (err) {
            toastRef.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Durum güncellenemedi',
                life: 3000,
            });
        }
    };

    return (
        <>
            <Toast ref={toastRef} />
            <div className="kanban-board">
                {COLUMNS.map((col) => {
                    const tasks = getColumnTasks(col.durum);
                    const isOver = dragOverColumn === col.durum;

                    return (
                        <div
                            key={col.durum}
                            className={`kanban-column ${isOver ? 'drag-over' : ''}`}
                            onDragOver={(e) => handleDragOver(e, col.durum)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, col.durum)}
                        >
                            {/* Column header */}
                            <div className="kanban-column-header" style={{ borderBottomColor: col.color }}>
                                <div className="kanban-column-title">
                                    <i className={col.icon} style={{ color: col.color }} />
                                    <span>{col.label}</span>
                                </div>
                                <span
                                    className="kanban-column-count"
                                    style={{ background: col.color }}
                                >
                                    {tasks.length}
                                </span>
                            </div>

                            {/* Column body */}
                            <div className="kanban-column-body" style={{ background: col.bgColor }}>
                                {tasks.length === 0 ? (
                                    <div className="kanban-empty">
                                        <i className="pi pi-inbox" />
                                        <span>Görev yok</span>
                                    </div>
                                ) : (
                                    tasks.map((gorev) => (
                                        <KanbanCard
                                            key={gorev.id}
                                            gorev={gorev}
                                            onDragStart={handleDragStart}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
