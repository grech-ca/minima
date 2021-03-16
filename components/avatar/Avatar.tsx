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
}

const Avatar: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  icon,
  color,
  size = 50,
  variant = 'square',
  ...props
}) => {
  return (
    <div
      {...props}
      className={classnames('transition-colors w-full h-full flex items-center justify-center select-none', {
        'rounded-lg': variant === 'square',
        'rounded-full': variant === 'round',
      })}
      style={{ backgroundColor: color, padding: `${size * 0.24}px` }}
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
