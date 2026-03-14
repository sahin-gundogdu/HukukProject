'use client';
import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Sidebar } from 'primereact/sidebar';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';

const AppConfig = () => {
    const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);

    const onConfigButtonClick = () => {
        setLayoutState((prev) => ({ ...prev, configSidebarVisible: true }));
    };

    const onConfigSidebarHide = () => {
        setLayoutState((prev) => ({ ...prev, configSidebarVisible: false }));
    };

    const changeInputStyle = (e: RadioButtonChangeEvent) => {
        setLayoutConfig((prev) => ({ ...prev, inputStyle: e.value }));
    };

    const changeRipple = (e: InputSwitchChangeEvent) => {
        setLayoutConfig((prev) => ({ ...prev, ripple: e.value as boolean }));
    };

    const changeMenuMode = (e: RadioButtonChangeEvent) => {
        setLayoutConfig((prev) => ({ ...prev, menuMode: e.value }));
    };

    const changeTheme = (theme: string, colorScheme: string) => {
        const themeLink = document.getElementById('theme-css') as HTMLLinkElement;
        if (themeLink) {
            const newHref = `/themes/${theme}/theme.css`;
            themeLink.href = newHref;
        }
        setLayoutConfig((prev) => ({ ...prev, theme, colorScheme }));
    };

    const decrementScale = () => {
        setLayoutConfig((prev) => ({ ...prev, scale: prev.scale - 1 }));
    };

    const incrementScale = () => {
        setLayoutConfig((prev) => ({ ...prev, scale: prev.scale + 1 }));
    };

    const scales = [12, 13, 14, 15, 16];

    return (
        <>
            <button className="layout-config-button config-link" type="button" onClick={onConfigButtonClick}>
                <i className="pi pi-cog" />
            </button>

            <Sidebar
                visible={layoutState.configSidebarVisible}
                onHide={onConfigSidebarHide}
                position="right"
                className="layout-config-sidebar w-20rem"
            >
                <h5>Ölçek</h5>
                <div className="flex align-items-center">
                    <Button icon="pi pi-minus" type="button" onClick={decrementScale} rounded text className="w-2rem h-2rem mr-2" disabled={layoutConfig.scale === scales[0]} />
                    <div className="flex gap-2 align-items-center">
                        {scales.map((s) => (
                            <i
                                key={s}
                                className={classNames('pi pi-circle-fill', { 'text-primary-500': s === layoutConfig.scale, 'text-300': s !== layoutConfig.scale })}
                            />
                        ))}
                    </div>
                    <Button icon="pi pi-plus" type="button" onClick={incrementScale} rounded text className="w-2rem h-2rem ml-2" disabled={layoutConfig.scale === scales[scales.length - 1]} />
                </div>

                <h5>Menü Modu</h5>
                <div className="flex">
                    <div className="field-radiobutton flex-1">
                        <RadioButton name="menuMode" value="static" checked={layoutConfig.menuMode === 'static'} onChange={changeMenuMode} inputId="mode1" />
                        <label htmlFor="mode1">Statik</label>
                    </div>
                    <div className="field-radiobutton flex-1">
                        <RadioButton name="menuMode" value="overlay" checked={layoutConfig.menuMode === 'overlay'} onChange={changeMenuMode} inputId="mode2" />
                        <label htmlFor="mode2">Overlay</label>
                    </div>
                </div>

                <h5>Input Stili</h5>
                <div className="flex">
                    <div className="field-radiobutton flex-1">
                        <RadioButton name="inputStyle" value="outlined" checked={layoutConfig.inputStyle === 'outlined'} onChange={changeInputStyle} inputId="outlined_input" />
                        <label htmlFor="outlined_input">Outlined</label>
                    </div>
                    <div className="field-radiobutton flex-1">
                        <RadioButton name="inputStyle" value="filled" checked={layoutConfig.inputStyle === 'filled'} onChange={changeInputStyle} inputId="filled_input" />
                        <label htmlFor="filled_input">Filled</label>
                    </div>
                </div>

                <h5>Ripple Efekti</h5>
                <InputSwitch checked={layoutConfig.ripple} onChange={changeRipple} />

                <h5>Tema</h5>
                <div className="grid">
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => changeTheme('lara-light-indigo', 'light')}>
                            <img src="/layout/images/themes/lara-light-indigo.png" className="w-2rem h-2rem" alt="Lara Light Indigo" style={{ borderRadius: '50%', background: '#6366f1' }} />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => changeTheme('lara-dark-indigo', 'dark')}>
                            <img src="/layout/images/themes/lara-dark-indigo.png" className="w-2rem h-2rem" alt="Lara Dark Indigo" style={{ borderRadius: '50%', background: '#4338ca' }} />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => changeTheme('lara-light-blue', 'light')}>
                            <img src="/layout/images/themes/lara-light-blue.png" className="w-2rem h-2rem" alt="Lara Light Blue" style={{ borderRadius: '50%', background: '#3b82f6' }} />
                        </button>
                    </div>
                    <div className="col-3">
                        <button className="p-link w-2rem h-2rem" onClick={() => changeTheme('lara-dark-blue', 'dark')}>
                            <img src="/layout/images/themes/lara-dark-blue.png" className="w-2rem h-2rem" alt="Lara Dark Blue" style={{ borderRadius: '50%', background: '#1e40af' }} />
                        </button>
                    </div>
                </div>
            </Sidebar>
        </>
    );
};

export default AppConfig;
