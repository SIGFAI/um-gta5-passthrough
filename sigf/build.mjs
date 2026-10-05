// universal-modder's Minecraft x GTA V passthrough (rehan-remade/universal-modder examples/minecraft-gta5-passthrough,
// MIT): real Minecraft 26.3 drawn into GTA V Legacy story mode. No upstream release: SIGF built MCPassthrough.asi and
// the Fabric jar from the pinned commit on a disposable AWS builder (library/QC.md section 4; source.json "built"),
// hosted on SIGFAI/um-gta5-passthrough with ReShade 6.8.0 (BSD-3-Clause, unchanged). ScriptHookV is linked, never shipped.
//   SIGF_LIBRARY_BUILDS=<dir> node library/um-gta5-passthrough/build.mjs      (outputs: library/lib.mjs)
import { instanceName } from '../../orchestrator/scripts/package-fusion.mjs';
import { mrpack, resolveFabricApi } from '../../orchestrator/src/recipe.js';
import { asset, card, dl, emit } from '../lib.mjs';
import { builtArtifacts, builtField, gtaAsset, gtaRequires, reshadeAsset, reshadeBundled, sourceOf } from './sigf-build.mjs';

const ID = 'um-gta5-passthrough', VERSION = '0.1.0', NAME = 'Minecraft x GTA V Passthrough';
const SRC = sourceOf(ID);
const UP = { repo: 'https://github.com/rehan-remade/universal-modder', path: 'examples/minecraft-gta5-passthrough', commit: SRC.commit, authors: ['rehan-remade'] };
const MC = { mc: '26.3', loader: '0.19.5', fabricApi: '0.161.0+26.3', java: '25' }; // mc/gradle.properties at the commit
const JAR = 'passthrough-0.1.0.jar';
const TAGLINE = 'Real Minecraft 26.3 drawn into GTA V story mode: build with blocks that become GTA props, TNT and creepers blow up both worlds, elytra over Los Santos.';

const files = builtArtifacts(ID);
const reshade = reshadeAsset(files);
// args.txt as upstream's gta/install.sh writes it: story mode with BattlEye off (GTA Online stays out).
const gta = gtaAsset(ID, files, { args: '-nobattleye -noBE', extra: [{ name: 'LICENSE-passthrough.txt', data: files.get('LICENSE') }] });
const pack = async (offline) => {
  const fabricApi = offline ? null : await resolveFabricApi(MC.fabricApi, MC.mc);
  if (!offline && !fabricApi?.download) throw new Error(`Fabric API ${MC.fabricApi} not resolved on Modrinth`);
  return asset(`${ID}.mrpack`, mrpack({ name: NAME, summary: TAGLINE, versions: MC, versionId: VERSION, fabricApi,
    jars: [{ name: JAR, data: files.get(JAR) }], extra: [{ name: 'overrides/licenses/passthrough-LICENSE.txt', data: files.get('LICENSE') }] }));
};
const assets = [reshade, gta, await pack(false)];

const make = (urls, set) => {
  const mp = set.find(a => a.name.endsWith('.mrpack'));
  return {
    id: `sigf/${ID}`,
    version: VERSION,
    name: NAME,
    tagline: TAGLINE,
    kind: 'passthrough',
    games: [
      { game: 'gta5', role: 'host', label: 'GTA V Legacy', engine: 'GTA V Legacy (RAGE, story mode) + ScriptHookV ASI MCPassthrough (C++) + ReShade add-on', apps: { steam: '271590' }, builds: { steam: ['1.0.3889.0'] }, runtime: 'GTA V Legacy build 3889 (GTA5.exe); Enhanced is not supported' },
      { game: 'minecraft', role: 'guest', label: 'Minecraft', engine: 'Minecraft Java 26.3 + Fabric mod passthrough (Java)', mc: MC.mc, loader: `fabric@${MC.loader}`, java: MC.java },
    ],
    requires: [
      ...gtaRequires(reshade, urls, { shvNote: 'ScriptHookV for your GTA V Legacy build (3889.0 for build 3889): copy ScriptHookV.dll and dinput8.dll from its bin folder into the GTA V folder' }),
      { id: 'fabric-loader', version: MC.loader },
      { id: 'fabric-api', version: MC.fabricApi, note: 'in the Minecraft pack (downloaded from Modrinth)' },
    ],
    install: [
      { game: 'gta5', strategy: 'game-dir-snapshot', loader: 'scripthookv', files: [
        { src: reshade.name, dst: '{game}', unpack: true, contents: reshade.contents, ...dl(reshade, urls) },
        { src: gta.name, dst: '{game}', unpack: true, contents: gta.contents, ...dl(gta, urls) },
      ] },
      { game: 'minecraft', strategy: 'mrpack', pack: { src: mp.name, ...dl(mp, urls) } },
    ],
    // Minecraft first (its mod serves the link on 127.0.0.1:25599), then GTA V; the player picks Story Mode.
    launch: [{ game: 'minecraft', wait: 'port:25599' }, { game: 'gta5', args: [] }],
    files: set.map(a => ({ name: a.name, ...dl(a, urls) })),
    source: {
      repo: UP.repo, path: UP.path, license: 'MIT AND BSD-3-Clause', upstream_license: SRC.license, commit: UP.commit,
      hosted: `https://github.com/SIGFAI/${ID}`,
      built: builtField(ID),
      bundled: [reshadeBundled()],
    },
    media: {},
    built_by: { author: UP.authors[0], authors: UP.authors, packaged_by: 'SIGF' },
    idea_by: UP.authors[0],
    built_at: '2026-10-05T00:00:00.000Z',
    ...card(UP.repo),
    notes: [
      'You need GTA V Legacy (Steam, GTA5.exe, build 3889; not the Enhanced edition) and Minecraft: Java Edition. Windows only.',
      'Install ScriptHookV yourself first (it may not be redistributed): download it for your GTA build from dev-c.com and copy ScriptHookV.dll and dinput8.dll from its bin folder into the GTA V folder.',
      'The app adds MCPassthrough.asi, ReShade 6.8.0 (as ReShade64.asi, with ReShade.ini and the MCPassthrough effect) and args.txt (-nobattleye -noBE) to the GTA V folder; Restore removes them and puts back any file they replaced.',
      `Press Play: Minecraft starts first (the app's Prism instance "${instanceName(`sigf/${ID}`)}", Minecraft ${MC.mc}, Fabric Loader ${MC.loader}, Fabric API ${MC.fabricApi}, Java ${MC.java}); leave its window open. Then GTA V starts with BattlEye off: pick Story Mode on the landing page yourself.`,
      'Story mode only, never GTA Online: BattlEye stays off while the files are installed. Back up your saves first.',
      'GTA settings that work: windowed 1920x1080, "Pause game on focus loss" off, depth of field off. F7 toggles the passthrough, F8 re-levels the Minecraft ground. Third person can stutter; first person plays best (issue #60).',
      'The link listens on 127.0.0.1:25599 with no authentication while Minecraft runs (upstream design).',
      `SIGF build of universal-modder ${UP.commit.slice(0, 7)} (no upstream release). Beta: report bugs to the author on the upstream issue tracker.`,
    ],
  };
};

emit({ slug: ID, version: VERSION, assets, make });
