import { FC, HTMLAttributes } from 'react';

import classnames from 'classnames';

import Image from 'next/image';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

type AvatarVariant = 'round' | 'square';

interface Props {
  icon: string;
  color: string;
  size?: number;
  variant?: AvatarVariant;
  stretch?: boolean;
}

const Avatar: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  icon,
  color,
  size = 50,
  variant = 'square',
  stretch,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classnames(
        'transition-colors flex items-center justify-center select-none',
        {
          'rounded-lg': variant === 'square',
          'rounded-full': variant === 'round',
        },
        className,
      )}
      style={{
        backgroundColor: color,
        padding: `${size * 0.24}px`,
        height: stretch ? '100%' : `${size * 1.24}px`,
        width: stretch ? '100%' : `${size * 1.24}px`,
      }}
    >
      <SwitchTransition>
        <CSSTransition<undefined>
          key={icon}
          classNames="avatar-icon"
          addEndListener={(node: HTMLElement, done: () => void) => {
            node.addEventListener('transitionend', done, false);
          }}
        >
          <Image className="pointer-events-none" src={`/avatars/${icon}.svg`} height={size} width={size} />
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default Avatar;
