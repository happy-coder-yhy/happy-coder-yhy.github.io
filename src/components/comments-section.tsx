'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

export function CommentsSection() {
  const { theme } = useTheme();

  return (
    <div className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-700">
      <h2 className="mb-6 text-2xl font-semibold">
        💬 评论
      </h2>
      <Giscus
        repo="happy-coder-yhy/haoyuyuan.github.io"
        repoId="R_kgDOQMM8oQ"
        category="Announcements"
        categoryId="DIC_kwDOQMM8oc4Cxfsu"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme === 'dark' ? 'dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
