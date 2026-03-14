'use client';
import React from 'react';
import { GorevDto, OncelikSeviyesi } from '@/types';
import { Tag } from 'primereact/tag';
import { ONCELIK_LABELS, ONCELIK_SEVERITY, formatDate, isOverdue } from '@/utils/formatters';
import Link from 'next/link';

interface KanbanCardProps {
    gorev: GorevDto;
    onDragStart: (e: React.DragEvent, gorev: GorevDto) => void;
}

const ONCELIK_COLORS: Record<OncelikSeviyesi, string> = {
    [OncelikSeviyesi.Dusuk]: '#3b82f6',
    [OncelikSeviyesi.Orta]: '#f59e0b',
    [OncelikSeviyesi.Yuksek]: '#ef4444',
    [OncelikSeviyesi.Kritik]: '#7c3aed',
};

export default function KanbanCard({ gorev, onDragStart }: KanbanCardProps) {
    const overdue = isOverdue(gorev.bitisTarihi, gorev.durum);

    return (
        <div
            className="kanban-card"
            draggable
            onDragStart={(e) => onDragStart(e, gorev)}
        >
            {/* Priority indicator line */}
            <div
                className="kanban-card-priority-line"
                style={{ background: ONCELIK_COLORS[gorev.oncelik] }}
            />

            <div className="kanban-card-content">
                {/* Header: title + priority */}
                <div className="kanban-card-header">
                    <Link href={`/gorevler/${gorev.id}`} className="kanban-card-title">
                        {gorev.baslik}
                    </Link>
                </div>

                {/* Tags row */}
                <div className="kanban-card-tags">
                    <Tag
                        value={ONCELIK_LABELS[gorev.oncelik]}
                        severity={ONCELIK_SEVERITY[gorev.oncelik] as any}
                        style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                    />
                    {gorev.gorevTipiAdi && (
                        <Tag
                            value={gorev.gorevTipiAdi}
                            style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                background: 'var(--surface-200)',
                                color: 'var(--surface-700)',
                            }}
                        />
                    )}
                </div>

                {/* Etiketler */}
                {gorev.etiketler?.length > 0 && (
                    <div className="kanban-card-etiketler">
                        {gorev.etiketler.slice(0, 3).map((e, i) => (
                            <span key={i} className="kanban-etiket">{e}</span>
                        ))}
                        {gorev.etiketler.length > 3 && (
                            <span className="kanban-etiket">+{gorev.etiketler.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Footer: assignee + date */}
                <div className="kanban-card-footer">
                    <div className="kanban-card-assignee">
                        <i className="pi pi-user" style={{ fontSize: '0.75rem' }} />
                        <span>{gorev.atananKullaniciAdi ?? gorev.atananGrupAdi ?? '-'}</span>
                    </div>
                    {gorev.bitisTarihi && (
                        <div className={`kanban-card-date ${overdue ? 'overdue' : ''}`}>
                            <i className="pi pi-calendar" style={{ fontSize: '0.7rem' }} />
                            <span>{formatDate(gorev.bitisTarihi)}</span>
                        </div>
                    )}
                </div>

                {/* Subtask/comment counts */}
                {(gorev.altGorevSayisi > 0 || gorev.yorumSayisi > 0) && (
                    <div className="kanban-card-meta">
                        {gorev.altGorevSayisi > 0 && (
                            <span><i className="pi pi-list" /> {gorev.altGorevSayisi}</span>
                        )}
                        {gorev.yorumSayisi > 0 && (
                            <span><i className="pi pi-comment" /> {gorev.yorumSayisi}</span>
                        )}
                        {gorev.dosyaSayisi > 0 && (
                            <span><i className="pi pi-paperclip" /> {gorev.dosyaSayisi}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
