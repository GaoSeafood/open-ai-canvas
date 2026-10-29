import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Clapperboard, FileText, Image, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { BrandMascot } from "@/components/brand/brand-mascot";
import { MIGE_BRAND } from "@/lib/brand";
import "./mige-welcome.css";

const workflows = [
    {
        name: "故事",
        title: "先有一个，让你想拍的故事。",
        description: "从一句对白、一个人物或一个突如其来的念头开始。把散落的想法写下来，再慢慢找到它的形状。",
        icon: FileText,
        image: "/short-drama-styles/suspense-noir.jpg",
        caption: "01 / STORY",
        href: "/create",
    },
    {
        name: "画面",
        title: "让脑海里的画面，有迹可循。",
        description: "把角色、场景和参考放在一起。用图片与视频创作，尝试不同的构图、光线和镜头语言。",
        icon: Image,
        image: "/short-drama-styles/retro-hong-kong.jpg",
        caption: "02 / FRAME",
        href: "/create",
    },
    {
        name: "画布",
        title: "一张画布，装下整个创作现场。",
        description: "连接剧本、角色、场景与镜头，随时回看和继续修改。让每一次尝试，都成为下一镜的起点。",
        icon: Clapperboard,
        image: "/short-drama-styles/cyberpunk-neon.jpg",
        caption: "03 / CANVAS",
        href: "/canvas",
    },
] as const;

export function MigeWelcomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [workflow, setWorkflow] = useState(0);
    const active = workflows[workflow];
    return (
        <div className="mige-site">
            <a href="#mige-main" className="mige-skip">
                跳到内容
            </a>
            <header className="mige-nav">
                <a className="mige-wordmark" href="/welcome" aria-label="米格首页">
                    <BrandLogo className="mige-logo" fallback={null} />
                    <span>
                        米格<small>MIGE</small>
                    </span>
                </a>
                <nav className={menuOpen ? "mige-links is-open" : "mige-links"} aria-label="网站导航">
                    <a href="#mige-workflow" onClick={() => setMenuOpen(false)}>
                        创作方式
                    </a>
                    <a href="#mige-space" onClick={() => setMenuOpen(false)}>
                        你的片场
                    </a>
                    <a href="https://github.com/GaoSeafood/open-ai-canvas" target="_blank" rel="noreferrer">
                        开源项目
                        <ArrowUpRight size={14} />
                    </a>
                </nav>
                <a className="mige-button mige-nav-cta" href="/create">
                    进入工作台
                    <ArrowUpRight size={16} />
                </a>
                <button className="mige-menu" type="button" aria-label={menuOpen ? "关闭菜单" : "打开菜单"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X /> : <Menu />}
                </button>
            </header>
            <main id="mige-main">
                <section className="mige-hero" aria-labelledby="mige-hero-title">
                    <div className="mige-hero-copy">
                        <p className="mige-eyebrow">MIGE / AI CREATIVE STUDIO</p>
                        <h1 id="mige-hero-title">
                            让脑洞，
                            <br />
                            <span>开拍。</span>
                        </h1>
                        <p className="mige-hero-description">
                            一个想法，也值得一个好镜头。
                            <br />
                            和米格一起，把故事、角色与画面连成作品。
                        </p>
                        <div className="mige-actions">
                            <a className="mige-button" href="/create">
                                开始创作
                                <ArrowUpRight size={18} />
                            </a>
                            <a className="mige-text-link" href="#mige-workflow">
                                看看怎么拍
                                <ArrowDown size={16} />
                            </a>
                        </div>
                        <p className="mige-hero-note">AI 影像创作工作台 · 故事 / 分镜 / 自由画布</p>
                    </div>
                    <div className="mige-hero-art">
                        <span className="mige-art-caption">MEET MIJIU / 你的创作搭子</span>
                        <BrandMascot className="mige-hero-mascot" />
                        <span className="mige-art-footnote">
                            一点脑洞，一起开拍。<span>TAKE 001</span>
                        </span>
                    </div>
                </section>
                <div className="mige-section-divider">
                    <span>从一个念头，到下一镜。</span>
                    <span>IDEA → STORY → FRAME</span>
                </div>
                <section id="mige-workflow" className="mige-workflow" aria-labelledby="mige-workflow-title">
                    <header className="mige-section-heading">
                        <div>
                            <p className="mige-eyebrow">01 / THE CREATIVE PROCESS</p>
                            <h2 id="mige-workflow-title">
                                你的故事，
                                <br />
                                有自己的拍法。
                            </h2>
                        </div>
                        <p>
                            先聊想法，再试画面。
                            <br />
                            按自己的节奏，把创作往前推。
                        </p>
                    </header>
                    <div className="mige-workflow-layout">
                        <div className="mige-workflow-list" role="tablist" aria-label="创作流程">
                            {workflows.map((item, index) => (
                                <button
                                    key={item.name}
                                    type="button"
                                    role="tab"
                                    id={`mige-step-${index}`}
                                    aria-selected={workflow === index}
                                    aria-controls="mige-step-panel"
                                    tabIndex={workflow === index ? 0 : -1}
                                    className={workflow === index ? "is-active" : ""}
                                    onClick={() => setWorkflow(index)}
                                    onKeyDown={(event) => {
                                        const next =
                                            event.key === "ArrowRight" || event.key === "ArrowDown"
                                                ? (index + 1) % workflows.length
                                                : event.key === "ArrowLeft" || event.key === "ArrowUp"
                                                  ? (index + workflows.length - 1) % workflows.length
                                                  : event.key === "Home"
                                                    ? 0
                                                    : event.key === "End"
                                                      ? workflows.length - 1
                                                      : null;
                                        if (next === null) return;
                                        event.preventDefault();
                                        setWorkflow(next);
                                        document.getElementById(`mige-step-${next}`)?.focus();
                                    }}
                                >
                                    <span className="mige-step-number">0{index + 1}</span>
                                    <span>
                                        <strong>{item.name}</strong>
                                        <small>{item.title}</small>
                                    </span>
                                    <ArrowUpRight size={20} />
                                </button>
                            ))}
                        </div>
                        <div className="mige-workflow-preview" id="mige-step-panel" role="tabpanel" aria-labelledby={`mige-step-${workflow}`} tabIndex={0}>
                            <img src={active.image} alt={`${active.name}创作的电影风格示意画面`} width={1280} height={720} loading="lazy" />
                            <div className="mige-workflow-caption">
                                <span>{active.caption} · 风格示意</span>
                                <h3>{active.title}</h3>
                                <p>{active.description}</p>
                                <a href={active.href}>
                                    从这里开始
                                    <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="mige-space" className="mige-space" aria-labelledby="mige-space-title">
                    <div>
                        <p className="mige-eyebrow">02 / YOUR OWN FILM STUDIO</p>
                        <h2 id="mige-space-title">
                            灵感可以很散，
                            <br />
                            创作可以有序。
                        </h2>
                        <p className="mige-space-description">
                            剧本、角色、场景、参考素材，终于有了同一个去处。
                            <br />
                            回到片场，就能接着上一次的灵感继续。
                        </p>
                        <a href="/canvas" className="mige-text-link">
                            打开自由画布
                            <ArrowUpRight size={18} />
                        </a>
                    </div>
                    <div className="mige-story-grid" aria-label="创作流程示意">
                        <div className="mige-story-note">
                            <FileText size={16} />
                            <span>故事片段</span>
                            <p>
                                雨停了。
                                <br />
                                她还在等一个，
                                <br />
                                没有说完的故事。
                            </p>
                            <small>从一句话开始。</small>
                        </div>
                        <figure className="mige-story-frame">
                            <img src="/short-drama-styles/cyberpunk-neon.jpg" alt="雨夜城市的霓虹风格参考" width={1280} height={720} loading="lazy" />
                            <figcaption>
                                <Clapperboard size={14} />
                                镜头参考 · 风格示意
                            </figcaption>
                        </figure>
                        <span className="mige-story-connection" aria-hidden="true">
                            <ArrowRight size={20} />
                        </span>
                        <span className="mige-story-label">STORY → FRAME / 保留每一次尝试</span>
                    </div>
                </section>
                <section className="mige-invitation">
                    <img src="/logo.svg" alt="" width={72} height={72} loading="lazy" />
                    <p className="mige-eyebrow">YOUR NEXT STORY STARTS HERE</p>
                    <h2>下一镜，交给你的想象。</h2>
                    <a className="mige-button" href="/create">
                        和米格一起开拍
                        <ArrowUpRight size={18} />
                    </a>
                </section>
            </main>
            <footer className="mige-footer">
                <a className="mige-footer-brand" href="/welcome">
                    {MIGE_BRAND.name}
                    <span>MIGE / CREATIVE STUDIO</span>
                </a>
                <span>© {new Date().getFullYear()} 米格 · 基于开源影策构建</span>
                <a href="https://github.com/ddcat-ai/open-ai-canvas" target="_blank" rel="noreferrer">
                    开源致谢
                    <ArrowUpRight size={14} />
                </a>
            </footer>
        </div>
    );
}
