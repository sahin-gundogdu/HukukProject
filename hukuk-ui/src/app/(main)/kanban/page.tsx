'use client';
import React, { useState, useEffect } from 'react';
import { useGorevler } from '@/layout/hooks/useApi';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import KanbanBoard from '../gorevler/KanbanBoard';
import { GorevDurumu, OncelikSeviyesi } from '@/types';
import { DURUM_LABELS, ONCELIK_LABELS } from '@/utils/formatters';

export default function KanbanPage() {
    const [filters, setFilters] = useState<any>({});
    const [aramaMetni, setAramaMetni] = useState('');
    const [debouncedAramaMetni, setDebouncedAramaMetni] = useState('');

    // Debounce effect: Wait for 500ms after last keystroke before triggering search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedAramaMetni(aramaMetni);
        }, 500);

        return () => clearTimeout(handler);
    }, [aramaMetni]);

    const { data: gorevler, isLoading } = useGorevler({ ...filters, aramaMetni: debouncedAramaMetni || undefined });

    const durumOptions = Object.values(GorevDurumu).filter(v => typeof v === 'number').map(v => ({
        label: DURUM_LABELS[v as GorevDurumu], value: v,
    }));
    const oncelikOptions = Object.values(OncelikSeviyesi).filter(v => typeof v === 'number').map(v => ({
        label: ONCELIK_LABELS[v as OncelikSeviyesi], value: v,
    }));

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title"><i className="pi pi-th-large" /> Kanban Board</h1>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'end' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>Arama</label>
                        <InputText value={aramaMetni} onChange={e => setAramaMetni(e.target.value)}
                            placeholder="Görev ara..." style={{ width: '100%' }} />
                    </div>
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

                <KanbanBoard gorevler={gorevler || []} />
            </div>
        </div>
    );
}
