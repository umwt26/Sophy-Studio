using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Collections.Generic;

public static class WinProps {
    [StructLayout(LayoutKind.Sequential, Pack = 4)]
    public struct PROPERTYKEY { public Guid fmtid; public uint pid; public PROPERTYKEY(Guid g, uint p) { fmtid = g; pid = p; } }

    [StructLayout(LayoutKind.Explicit)]
    public struct PROPVARIANT {
        [FieldOffset(0)] public ushort vt;
        [FieldOffset(8)] public IntPtr p;
        [FieldOffset(16)] public IntPtr p2;
    }

    [ComImport, Guid("886D8EEB-8CF2-4446-8D02-CDBA1DBDCF99"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IPropertyStore {
        int GetCount(out uint c);
        int GetAt(uint i, out PROPERTYKEY k);
        int GetValue(ref PROPERTYKEY k, out PROPVARIANT v);
        int SetValue(ref PROPERTYKEY k, ref PROPVARIANT v);
        int Commit();
    }

    [DllImport("shell32.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
    static extern void SHGetPropertyStoreFromParsingName(string path, IntPtr pbc, int flags, ref Guid riid, out IPropertyStore store);
    [DllImport("propsys.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
    static extern void InitPropVariantFromStringVector([In] string[] prgsz, uint cElems, out PROPVARIANT ppropvar);
    [DllImport("ole32.dll")] static extern int PropVariantClear(ref PROPVARIANT v);

    static readonly Guid SummaryFmt = new Guid("F29F85E0-4FF9-1068-AB91-08002B27B3D9");
    static readonly Guid MusicFmt = new Guid("56A3372E-CE9C-11D2-9F0E-006097C686F6");

    public static string SetTitleArtist(string path, string title, string artist) {
        try {
            Guid iid = typeof(IPropertyStore).GUID;
            IPropertyStore st;
            SHGetPropertyStoreFromParsingName(path, IntPtr.Zero, 2 /*GPS_READWRITE*/, ref iid, out st);
            var kTitle = new PROPERTYKEY(SummaryFmt, 2);
            PROPVARIANT v = new PROPVARIANT(); v.vt = 31; v.p = Marshal.StringToCoTaskMemUni(title);
            st.SetValue(ref kTitle, ref v);
            var kArtist = new PROPERTYKEY(MusicFmt, 2);
            PROPVARIANT va; InitPropVariantFromStringVector(new[] { artist }, 1, out va);
            st.SetValue(ref kArtist, ref va);
            int hr = st.Commit();
            Marshal.ReleaseComObject(st);
            return "commit hr=0x" + hr.ToString("X");
        } catch (Exception e) { return "ERR " + e.Message; }
    }

    // --- thumbnail (to see if Explorer shows embedded cover art) ---
    [ComImport, Guid("bcc18b79-ba16-442f-80c4-8a59c30c463b"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IShellItemImageFactory { int GetImage(SIZE size, int flags, out IntPtr phbm); }
    [StructLayout(LayoutKind.Sequential)] public struct SIZE { public int cx, cy; }
    [DllImport("shell32.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
    static extern void SHCreateItemFromParsingName(string path, IntPtr pbc, ref Guid riid, out IShellItemImageFactory f);
    [DllImport("gdi32.dll")] static extern bool DeleteObject(IntPtr h);

    public static string ThumbInfo(string path) {
        try {
            Guid iid = typeof(IShellItemImageFactory).GUID;
            IShellItemImageFactory f;
            SHCreateItemFromParsingName(path, IntPtr.Zero, ref iid, out f);
            IntPtr hbm;
            int hr = f.GetImage(new SIZE { cx = 96, cy = 96 }, 0x8 /*SIIGBF_THUMBNAILONLY*/, out hbm);
            if (hr != 0) return "no thumbnail (hr=0x" + hr.ToString("X") + ")";
            using (var bmp = Image.FromHbitmap(hbm)) {
                var colors = new HashSet<int>();
                for (int x = 0; x < bmp.Width; x += 3) for (int y = 0; y < bmp.Height; y += 3) colors.Add(bmp.GetPixel(x, y).ToArgb());
                DeleteObject(hbm);
                return "thumbnail " + bmp.Width + "x" + bmp.Height + " distinctColors=" + colors.Count;
            }
        } catch (Exception e) { return "ERR " + e.Message; }
    }
}
