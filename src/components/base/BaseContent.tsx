import { resolve } from 'inversify-react';
import React from 'react';
import DialogService from '../../services/DialogService';
import LoadingService from '../../services/LoadingService';
import Header from '../layout/Header';
import ControlledComponent from './ControlledComponent';

export default abstract class BaseContent<P, S> extends ControlledComponent<P, S> {
  @resolve(DialogService)
  protected dialog: DialogService;
  @resolve(LoadingService)
  protected loading: LoadingService;

  abstract get section();
  abstract get headerContent();
  abstract get footerContent();

  protected readonly commonTemplate: React.FC<{ children: any, noPadding?: boolean, customHeaderTitle?: any, className?: string }> =
  ({ children, noPadding, className, customHeaderTitle }) => {
    const paddingClass = noPadding === true ? '' : ' px-2 py-2 ';
    const mainClass = `main-content mt-2 text-dark ${paddingClass} ${className ?? ''}`;
    return (
      <>
        <Header
          section={this.section}
          content={this.headerContent}
          customTitle={customHeaderTitle}
        />
        <main className={mainClass}>
          {children}
        </main>
        {this.footerContent}
      </>
    );
  };
}
