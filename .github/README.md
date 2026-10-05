# Minecraft x GTA V Passthrough

Real Minecraft 26.3 drawn into GTA V story mode: build with blocks that become GTA props, TNT and creepers blow up both worlds, elytra over Los Santos.

**Minecraft x GTA V Passthrough is made by [rehan-remade](https://github.com/rehan-remade).** All credit for the mod goes to them.

- Original project: https://github.com/rehan-remade/universal-modder
- Report bugs and ask questions there: https://github.com/rehan-remade/universal-modder/issues
- Upstream version packaged here: 0.1.0 (commit [`0f5dcdf`](https://github.com/rehan-remade/universal-modder/tree/0f5dcdfdcd8ed420f8413815bd6647586ab894a2), folder `examples/minecraft-gta5-passthrough`)
- **Built by SIGF from commit [`0f5dcdfdcd8ed420f8413815bd6647586ab894a2`](https://github.com/rehan-remade/universal-modder/tree/0f5dcdfdcd8ed420f8413815bd6647586ab894a2)** with the changes described below, on a disposable build machine (AWS EC2 i-0022be8314df37721 (c6i.4xlarge, Windows Server 2022, terminated after the build)). The app installs these SIGF builds, not binaries from the author.

> **Beta.** Nobody at SIGF has played this build yet. Back up your saves.
> Bugs in the mod itself go to the author's issue tracker above; problems with the one-click install go to this repository's issues.

## What you need

- **GTA V Legacy** ([Steam](https://store.steampowered.com/app/271590/)): GTA V Legacy build 3889 (GTA5.exe); Enhanced is not supported.
- **Minecraft**: Java Edition 26.3.
- scripthookv: ScriptHookV for your GTA V Legacy build (3889.0 for build 3889): copy ScriptHookV.dll and dinput8.dll from its bin folder into the GTA V folder (https://www.dev-c.com/gtav/scripthookv/).
- Windows and the [SIGF app](https://sigf.ai). The app installs reshade 6.8.0 (add-on), fabric-loader 0.19.5, fabric-api 0.161.0+26.3 for you.

## Install

In the SIGF app, open **Minecraft x GTA V Passthrough** in the catalog, press **Install**, then **Play**. **Restore** puts your game folders back exactly as they were.
The app follows `mashup.json` in this repository: every download is pinned by sha256. The files come from the release [`v0.1.0`](../../releases/tag/v0.1.0).

### Good to know

- You need GTA V Legacy (Steam, GTA5.exe, build 3889; not the Enhanced edition) and Minecraft: Java Edition. Windows only.
- Install ScriptHookV yourself first (it may not be redistributed): download it for your GTA build from dev-c.com and copy ScriptHookV.dll and dinput8.dll from its bin folder into the GTA V folder.
- The app adds MCPassthrough.asi, ReShade 6.8.0 (as ReShade64.asi, with ReShade.ini and the MCPassthrough effect) and args.txt (-nobattleye -noBE) to the GTA V folder; Restore removes them and puts back any file they replaced.
- Press Play: Minecraft starts first (the app's Prism instance "sigf-um-gta5-passthrough", Minecraft 26.3, Fabric Loader 0.19.5, Fabric API 0.161.0+26.3, Java 25); leave its window open. Then GTA V starts with BattlEye off: pick Story Mode on the landing page yourself.
- Story mode only, never GTA Online: BattlEye stays off while the files are installed. Back up your saves first.
- GTA settings that work: windowed 1920x1080, "Pause game on focus loss" off, depth of field off. F7 toggles the passthrough, F8 re-levels the Minecraft ground. Third person can stutter; first person plays best (issue #60).
- The link listens on 127.0.0.1:25599 with no authentication while Minecraft runs (upstream design).
- SIGF build of universal-modder 0f5dcdf (no upstream release). Beta: report bugs to the author on the upstream issue tracker.

## What this repository holds

1. The upstream source tree at commit [`0f5dcdfdcd8ed420f8413815bd6647586ab894a2`](https://github.com/rehan-remade/universal-modder/tree/0f5dcdfdcd8ed420f8413815bd6647586ab894a2), every file unchanged (same git blobs), except upstream's GitHub Actions workflows (`.github/workflows/`, upstream CI only, not part of the build), which are left out; see them upstream. Upstream's own `README.md` is there, unchanged; GitHub shows this file (`.github/README.md`) first.
2. Added by SIGF in the same commit: this file, `THIRD-PARTY.md` (licenses and sources of the third-party files in the release), and `sigf/` (the scripts that built the release assets, for reference: they run inside the SIGF repository).
3. `mashup.json`, the SIGF app recipe (the next commit).
4. The release `v0.1.0` (its tag is the first commit):

| Asset | Size | sha256 | What it is |
|---|---|---|---|
| `reshade-6.8.0-addon.zip` | 2460727 B | `d4167356162b209be93b6a35cf7e1253cffb2ac00746cf007a7201d362b00d07` | ReShade 6.8.0 (add-on build, crosire): the official `ReShade64.dll` unchanged as `ReShade64.asi`, its BSD-3-Clause license and the CC0 shader headers (see THIRD-PARTY.md); into the GTA V folder. |
| `um-gta5-passthrough-gta5.zip` | 186111 B | `67d3f69e0e540d25cc6169891104e52ff00058e2eaf7fc62daf745cc608c5673` | the SIGF build of `MCPassthrough.asi` and `MCPassthrough.fx` from the pinned commit, upstream's LICENSE, `ReShade.ini`, `ReShadePreset.ini` and `args.txt` (story mode, BattlEye off); into the GTA V folder. |
| `um-gta5-passthrough.mrpack` | 203944 B | `3c88e9c240c1f0c667b17cdbd8932895c0043e0b96a8cb6a2033c672c088cc30` | the Minecraft side: the SIGF build of `passthrough-0.1.0.jar` from the pinned commit, with upstream's LICENSE, for Minecraft 26.3 with Fabric Loader 0.19.5; Fabric API 0.161.0+26.3 is a Modrinth download link, not stored here. |

The sha256 of every file inside the zips is in `mashup.json` (`contents`).

## Licenses

| Part | License | Where |
|---|---|---|
| universal-modder (all of the upstream tree, and the SIGF builds of its `examples/minecraft-gta5-passthrough`) | MIT, Copyright Rehan and universal-modder contributors | `LICENSE` |
| ReShade 6.8.0 (release asset) | BSD-3-Clause; shader headers CC0-1.0 | `THIRD-PARTY.md` |
| Fabric API (downloaded from Modrinth by the app, not stored here) | Apache-2.0 | https://github.com/FabricMC/fabric |

## Why this repository exists

The SIGF app (https://sigf.ai) installs mods from recipes (`mashup.json`) whose downloads are pinned release files. This repository makes Minecraft x GTA V Passthrough installable in one click, credited to rehan-remade. If you are the author and want anything changed or taken down, open an issue here.
